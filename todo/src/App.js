import './App.css';

import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";

const API = "http://localhost:5000";

function App() {
  const[title, setTitle] = useState("");
  const[time, setTime] = useState("");
  const[todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  //Load todos on page load

  useEffect(() => {

    const loadData = async() => {
      setLoading(true)

      const res = await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);

      setTodos(res);
    };

    loadData();

  }, []);
  // qnd esse array ta vazio, é executado qnd a página recarrega

  const handleSubmit = async (e) => {
    // e de evento em si, é algo do javascript. Com ele consigo enviar o formulário e recarregar a página
  
    e.preventDefault();

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]);
    // com prevState eu consifo adicionar um item ao estado anterior e gerar um novo estado

    setTitle("");
    setTime("");
  };

  const handleDelete = async (id) => {

    await fetch(API + "/todos/" + id, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
    // pego todos os todo e faço uma comparação. se o id todo for diferente do id que veio pela requisição, eu retorno esse todo, se não ele não retorna
  }

  const handleEdit = async(todo) => {
    todo.done = !todo.done;
    // se clicar numa tarefa que ta marcada como feita ela desfaz e vice versa

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => 
      prevState.map((t) => (t.id === data.id) ? (t=data) : t))
    // chamo cada todo de "t" no map
    // se o t.id = data.id, data =data. se não o t fica só t
  }

  if(loading) {
    return <p>Carregando...</p>
  }
  // se demorar pra carregar a página essa informação aparece

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>TO DO LIST</h1>
      </div>

      <div className='form-todo'>
        <h2>Insira sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor='title'>O que você vai fazer?</label>
            <input type='text' name='title' placeholder='Título da tarefa' 
            onChange={(e) => setTitle(e.target.value)}
            // a cada tecla que o usuário pressionar vai acionar o evento
            // e.target.value = e é o evento, target é meu input e estou colocando no title o valor desse input
            value={title || ""} 
            // valor = state do input. Uso da técnica "controlled input". Nesse caso vai ajudar a limpar o formulário
            // || "" -> digo que pode começar com valor vazio e quando tiver valor pro title ele troca
            required
            />
      </div>

          <div className='form-control'>
            <label htmlFor='time'>Duração:</label>
            <input type='text' name='time' placeholder='Tempo estimado (em horas)' 
            onChange={(e) => setTime(e.target.value)}
            value={time || ""} 
            required
            />
          </div>

          <input type="submit" value="Criar Tarefa"/>

        </form>
      </div>

      <div className='list-todo'>
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            {/* se todo tiver pronto, adiciono a class todo-done, se não a class fica vazia */}
            <p>Duração: {todo.time} horas</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : < BsBookmarkCheckFill /> }
                {/* se a tarefa não ta pronta, exibo o icono do check, se estiver, exibo icono do check fill */}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
              {/* se eu náo colocar em uma aero function, o navegador executa a ação assim que ler. Dessa forma ele espera o click */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
