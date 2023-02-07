const AnotherComponent = () => {
    const handleClick = () => {
        console.log("clicou no botão!")
    };

    return (
        <div>
            <p>segundo componente</p>
            <button onClick = {handleClick}>evento de click</button>
        </div>
    )
};

export default AnotherComponent;