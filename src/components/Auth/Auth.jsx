import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    });
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
    setError('');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (activeTab === 1 && formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      let result;
      if (activeTab === 0) {
        // Вход
        result = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Регистрация
        result = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
      }

      if (result.success) {
        navigate('/profile');
      } else {
        setError(result.error || 'Произошла ошибка');
      }
    } catch (err) {
      setError('Произошла ошибка. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <Container maxWidth="sm" className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Вход" />
          <Tab label="Регистрация" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} className="auth-form">
          {error && (
            <Alert severity="error" className="auth-alert">
              {error}
            </Alert>
          )}

          {activeTab === 1 && (
            <>
              <TextField
                label="Имя"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Фамилия"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                fullWidth
                required
                margin="normal"
              />
            </>
          )}

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Пароль"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange('password')}
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {activeTab === 1 && (
            <TextField
              label="Подтвердите пароль"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              fullWidth
              required
              margin="normal"
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            className="submit-button"
          >
            {activeTab === 0 ? 'Войти' : 'Зарегистрироваться'}
          </Button>

          {activeTab === 0 && (
            <Typography
              variant="body2"
              align="center"
              className="forgot-password"
            >
              <Button color="primary">Забыли пароль?</Button>
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth; 