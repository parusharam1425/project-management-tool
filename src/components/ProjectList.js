import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

import './Styles/ProjectList.css'

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(savedProjects.filter(project => user.role === 'Admin' || project.user === user.username));
  }, [user]);

  const handleDelete = (id) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  return (
    <div className="container">
      <h2>Projects</h2>
      <Link to="/create-project" className="btn btn-primary mb-3" style={{width:'50%', position:'relative', left:'25%'}}>Create New Project</Link>
      <ul className="list-group">
        {projects.map((project) => (
          <li key={project.id} className="list-group-item d-flex justify-content-between align-items-center"  >
            <Link to={`/project/${project.id}`} className='project-name'>{project.title}</Link>
            {user.role === 'Admin' && (
              <button className=" btn btn-danger btn-sm" onClick={() => handleDelete(project.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
