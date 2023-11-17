import "./Auth.css";

// components
import { Link } from "react-router-dom";

// hooks
import { useState, useEffect } from "react";

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2>ReactGram</h2>
      <p className="subtitle">Cadastre-se para ver as fotos de seus amigos!</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Senha" />
        <input type="password" placeholder="Confirme a senha" />
        <input type="submit" value="Cadastrar" />
      </form>
      <p>
        Já tem uma conta? <Link to="/login">Entre</Link>
      </p>
    </div>
  );
};

export default Register;
