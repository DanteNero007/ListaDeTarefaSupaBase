'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Task {
  id: string;
  task: string;
  time: string;
  reward: string;
  consequence: string;
}

export function FormTask() {
  const [task, setTask] = useState('');
  const [time, setTime] = useState('');
  const [reward, setReward] = useState('');
  const [consequence, setConsequence] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    
    fetchTasks();

  }, [tasks]);

  
  
 const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*'); 

  if (error ) {
      console.error('Erro ao buscar tarefas:', error);
    } else if (data) {
      setTasks(data);

    }
  
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Verifica se ao menos um campo foi preenchido
    setTask(' ');
    setTime(' ');
    setReward(' ');
    setConsequence(' ');

    
    if (!task && !time && !reward && !consequence) {
      alert('Por favor, preencha pelo menos um campo.');
      return;
    }

    // Insere a nova tarefa no Supabase somente se houver campos preenchidos
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ task, time, reward, consequence }]);

    if (error) {
      console.error('Erro ao inserir tarefa:', error);
    } else if (data && data) {
      // Atualiza o estado das tarefas com a nova tarefa
      setTasks((prevTasks) => [...prevTasks, data[0]]);
      // Limpa os campos do formulário
      }

  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 text-black"> {/* Adicionado text-black aqui */}
      <h1 className="text-2xl font-bold mb-4">Gerenciador de Tarefas</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label className="block">Tarefa</label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block">Horário</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block">Recompensa</label>
          <input
            type="text"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block">Consequência</label>
          <input
            type="text"
            value={consequence}
            onChange={(e) => setConsequence(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Adicionar Tarefa
        </button>
      </form>

      <div className="w-full max-w-md mt-6">
        <h2 className="text-xl font-bold mb-2">Suas Tarefas</h2>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 mb-4 rounded-md shadow-md">
              <p><strong>Tarefa:</strong> {task.task}</p>
              <p><strong>Horário:</strong> {task.time}</p>
              <p><strong>Recompensa:</strong> {task.reward}</p>
              <p><strong>Consequência:</strong> {task.consequence}</p>
            </div>
          ))
        ) : (
          <p>Você ainda não tem tarefas.</p>
        )}
      </div>
    </div>
  );
}
