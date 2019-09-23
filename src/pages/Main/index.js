import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../Components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newRepo: '',
      repositories: [],
      loading: false,
      error: false,
    };
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value, error: false });
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      this.setState({ loading: true });

      const { newRepo, repositories } = this.state;
      const existRepo = repositories.find(repo => repo.name.toLowerCase() === newRepo.toLowerCase())

      if (existRepo) throw new Error('Repositório duplicado');

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
      });
    } catch (error) {
      console.log(error, this.state.error);

      this.setState({ loading: false, error: true });
    }
  };

  render() {
    const { newRepo, loading, error, repositories } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            value={newRepo}
            onChange={this.handleInputChange}
            placeholder="Adicionar repositório"
          />

          <SubmitButton onClick={this.handleSubmit} loading={loading}>
            {loading ? (
              <FaSpinner color="fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
