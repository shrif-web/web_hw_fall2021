import { Mutex, Semaphore, withTimeout } from 'async-mutex';
import dotenv from 'dotenv'
// import { property } from 'lodash';
dotenv.config();

const mutex = new Mutex();

const N_Max = process.env.Cache_Storage; // Cache Storage
let N = 0;

class ListNode {
  constructor(key, data) {
    this.key = key;
    this.data = data;
    this.next = -1;
    this.parent = -1;
  }
}
let list = -1; // First Node, Most Used
let last = -1; // Last Node ==> LRU
let map = {};

let id = 1;

export function showLinkList() {
  let t = list;
  let i = 1;
  while (t != -1) {
    // if (t.parent != -1)
    //   console.log(i + ': ' + t.data + ', Parent:' + t.parent.data);
    // else
    //   console.log(i + ': ' + t.data);
    // i = i + 1;
    console.log(t);
    t = t.next;
  }
}

export function GetKey(call, callback, op = 0) {
  mutex.runExclusive(async () => {
    let { key, value } = call.request;
    let message = 'Not found!';
    let successful = false;

    if (map[key] != undefined) {
      successful = true;
      message = map[key].data;
      if (map[key].next != -1 && map[key].parent != -1) {
        console.log('qq2');
        map[key].next.parent = map[key].parent;
        map[key].parent.next = map[key].next;
        map[key].parent = -1;
        map[key].next = list;
        list.parent = map[key];
        list = map[key];
      } else if (map[key].next == -1 && map[key].parent != -1) {
        console.log('qq2');
        map[key].parent.next = -1;
        last = map[key].parent;
        map[key].parent = -1;
        map[key].next = list;
        list.parent = map[key];
        list = map[key];
        if (last.parent == -1) {
          last.parent = list;
        }
      } else if (map[key].next == -1 && map[key].parent == -1) {
        last = map[key];
      }
    }
    if (process.env.Cache_DebugMode == 'True') {
      console.log('Linked List:')
      console.log(showLinkList())
      console.log('Last:')
      console.log(last)
      console.log('----------------------------' + id)
    }
    callback(null, {
      message: message,
      successful: successful
    });
  });
}

export function SetKey(call, callback) {
  mutex.runExclusive(async () => {
    let successful = true;
    let { key, value } = call.request;
    let message = 'Ok';
    if (key.length > 64 || value.length > 2048) {
      successful = false;
      message = 'Exceeded number of characters limit!';
    } else {
      if (map[key] != undefined) {
        console.log('Exist')
        map[key].data = value;
        if (map[key].next != -1 && map[key].parent != -1) {
          console.log('qq2');
          map[key].next.parent = map[key].parent;
          map[key].parent.next = map[key].next;
          map[key].parent = -1;
          map[key].next = list;
          list.parent = map[key];
          list = map[key];
        } else if (map[key].next == -1 && map[key].parent != -1) {
          console.log('qq2');
          map[key].parent.next = -1;
          last = map[key].parent;
          map[key].parent = -1;
          map[key].next = list;
          list.parent = map[key];
          list = map[key];
          if (last.parent == -1) {
            last.parent = list;
          }
        } else if (map[key].next == -1 && map[key].parent == -1) {
          last = map[key];
        }
      } else {
        if (N == N_Max) {
          map[last.key] = undefined;
          last.parent.next = -1;
          last = last.parent;
        } else {
          N = N + 1;
        }
        let t = new ListNode(key, value);
        t.next = list;
        if (last == -1) {
          last = t;
        }
        map[key] = t;
        if (list != -1)
          list.parent = t;
        list = t;
      }
    }
    callback(null, {
      successful: successful,
      message: message
    });
    console.log('Linked List:')
    console.log(showLinkList())
    console.log('Last:')
    console.log(last)
    console.log('----------------------------' + id)
    id = id + 1;
  });
}

export function ClearKey(call, callback) {
  mutex.runExclusive(async () => {
    let { key, value } = call.request;
    let successful = true;
    if (map[key] === undefined) {
      successful = false;
    }
    else {
      if (last == map[key]) {
        if (last.parent != -1) {
          last = last.parent;
          last.next = -1;
        } else {
          last = -1;
        }
      } else if (list == map[key]) {
        if (list.next != -1) {
          list = list.next;
          list.parent = -1;
        } else {
          list = -1;
        }
      } else {
        let t = map[key];
        console.log(t)
        t.next.parent = t.parent;
        t.parent.next = t.next;
      }
      map[key] = undefined;
      let slices = key.split("_");
      for (let property in map) {
        let tslices = property.split("_");
        if (tslices[0] == 'TEXTTABLE' && tslices[1] == slices[1] && +tslices[2] > +slices[2]) {
          let t = map[property];
          map[property] = undefined;
          map[tslices[0] + '_' + tslices[1] + '_' + (+tslices[2] - 1)] = t;
        }
      }
    }

    callback(null, {
      message: 'Ok',
      successful: successful
    });
  });
}

export function Clear(call, callback) {
  mutex.runExclusive(async () => {
    let successful = true;
    list = -1;
    last = -1;
    map = {};
    callback(null, {
      message: 'Ok',
      successful: successful
    });
  });
}

