function MyMine() {
  const onClick = (event) => {
    console.log('Clicked!');
  }

  return (
    <div onClick={onClick}>
      Here it is!
    </div>
  );
}

export default MyMine;
