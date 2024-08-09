import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStatus, setTaskStatus] = useState('To Do');

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const currentProject = savedProjects.find(project => project.id === parseInt(id));
    if (currentProject) {
      setProject(currentProject);
      setTitle(currentProject.title);
      setDescription(currentProject.description);
      setTasks(currentProject.tasks);
    }
  }, [id]);

  const handleSaveProject = (e) => {
    e.preventDefault();
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = savedProjects.map(proj =>
      proj.id === parseInt(id) ? { ...proj, title, description, tasks } : proj
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    navigate('/dashboard');
  };

  const handleDeleteProject = () => {
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = savedProjects.filter(proj => proj.id !== parseInt(id));
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    navigate('/dashboard');
  };

  const handleAddTask = () => {
    const newTask = { id: Date.now(), title: taskTitle, status: taskStatus };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setTaskTitle('');
    setTaskStatus('To Do');
    // Update local storage
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = savedProjects.map(proj =>
      proj.id === parseInt(id) ? { ...proj, tasks: updatedTasks } : proj
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const handleEditTask = (taskId, newTitle, newStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle, status: newStatus } : task
    );
    setTasks(updatedTasks);
    // Update local storage
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = savedProjects.map(proj =>
      proj.id === parseInt(id) ? { ...proj, tasks: updatedTasks } : proj
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    // Update local storage
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const updatedProjects = savedProjects.map(proj =>
      proj.id === parseInt(id) ? { ...proj, tasks: updatedTasks } : proj
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Project Details</h2>
      <form onSubmit={handleSaveProject}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-danger ml-2" onClick={handleDeleteProject}>Delete</button>
      </form>
      <h3>Tasks</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <select
          className="form-control mt-2"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button type="button" className="btn btn-primary mt-2"style={{width:'25%'}} onClick={handleAddTask}>Add Task</button>
      </div>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{task.title}</strong> - <span className="badge bg-secondary">{task.status}</span>
            </div>
            {user.role === 'Admin' && (
              <div>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => {
                    const newTitle = prompt('Edit task title:', task.title);
                    const newStatus = prompt('Edit task status (To Do, In Progress, Done):', task.status);
                    if (newTitle && newStatus) {
                      handleEditTask(task.id, newTitle, newStatus);
                    }
                  }}
                >
                  Edit
                </button>
                <button className="btn btn-danger btn-sm ml-2" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetail;
