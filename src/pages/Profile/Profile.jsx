import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Edit,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { bookings as bookingsApi, favorites as favoritesApi } from '../../api/client';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем бронирования и избранные туры параллельно
        const [bookingsData, favoritesData] = await Promise.all([
          bookingsApi.getAll(),
          favoritesApi.getAll(),
        ]);

        setBookings(bookingsData);
        setFavorites(favoritesData);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
      setEditedUser(user);
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    const result = await updateProfile(editedUser);
    if (result.success) {
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setEditMode(false);
  };

  const handleChange = (field) => (event) => {
    setEditedUser({
      ...editedUser,
      [field]: event.target.value,
    });
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingsApi.cancel(bookingId);
      // Обновляем список бронирований
      const updatedBookings = await bookingsApi.getAll();
      setBookings(updatedBookings);
    } catch (err) {
      console.error('Ошибка при отмене бронирования:', err);
    }
  };

  const handleRemoveFavorite = async (tourId) => {
    try {
      await favoritesApi.remove(tourId);
      // Обновляем список избранного
      const updatedFavorites = await favoritesApi.getAll();
      setFavorites(updatedFavorites);
    } catch (err) {
      console.error('Ошибка при удалении из избранного:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Подтверждено';
      case 'pending':
        return 'В обработке';
      case 'cancelled':
        return 'Отменено';
      default:
        return status;
    }
  };

  if (!user || !editedUser) {
    return <div>Загрузка...</div>;
  }

  return (
    <Container className="profile-container">
      {error && (
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card className="profile-card">
            <CardContent>
              <Box className="profile-header">
                <Avatar
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="profile-avatar"
                />
                <Typography variant="h5">
                  {user.firstName} {user.lastName}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEditClick}
                  className="edit-button"
                >
                  Редактировать профиль
                </Button>
              </Box>

              <List className="profile-info-list">
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                  />
                  <Email color="action" />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Телефон"
                    secondary={user.phone}
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                  />
                  <Phone color="action" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Мои бронирования" />
                <Tab label="Избранное" />
                <Tab label="Настройки" />
              </Tabs>

              <Box className="tab-content">
                {activeTab === 0 && (
                  <List>
                    {loading ? (
                      <Typography>Загрузка бронирований...</Typography>
                    ) : bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <Card key={booking.id} className="booking-item">
                          <CardContent>
                            <Box className="booking-header">
                              <Typography variant="h6">
                                {booking.tourTitle}
                              </Typography>
                              <Chip
                                label={getStatusText(booking.status)}
                                color={getStatusColor(booking.status)}
                                size="small"
                              />
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Дата начала:
                                </Typography>
                                <Typography>
                                  {new Date(booking.date).toLocaleDateString('ru-RU')}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Количество туристов:
                                </Typography>
                                <Typography>{booking.tourists}</Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="h6" color="secondary">
                                  {booking.price.toLocaleString()} ₽
                                </Typography>
                              </Grid>
                              {booking.status !== 'cancelled' && (
                                <Grid item xs={12}>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleCancelBooking(booking.id)}
                                  >
                                    Отменить бронирование
                                  </Button>
                                </Grid>
                              )}
                            </Grid>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Typography variant="body1" className="empty-tab">
                        У вас пока нет бронирований
                      </Typography>
                    )}
                  </List>
                )}

                {activeTab === 1 && (
                  <List>
                    {loading ? (
                      <Typography>Загрузка избранного...</Typography>
                    ) : favorites.length > 0 ? (
                      favorites.map((tour) => (
                        <Card key={tour.id} className="favorite-item">
                          <CardContent>
                            <Box className="favorite-header">
                              <Typography variant="h6">{tour.title}</Typography>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleRemoveFavorite(tour.id)}
                              >
                                Удалить из избранного
                              </Button>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {tour.description}
                            </Typography>
                            <Typography variant="h6" color="secondary" className="tour-price">
                              {tour.price.toLocaleString()} ₽
                            </Typography>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Typography variant="body1" className="empty-tab">
                        У вас пока нет избранных туров
                      </Typography>
                    )}
                  </List>
                )}

                {activeTab === 2 && (
                  <Box className="settings-tab">
                    <Typography variant="h6" gutterBottom>
                      Настройки уведомлений
                    </Typography>
                    {/* Добавьте настройки по необходимости */}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={editMode} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Редактировать профиль</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Имя"
                value={editedUser.firstName}
                onChange={handleChange('firstName')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Фамилия"
                value={editedUser.lastName}
                onChange={handleChange('lastName')}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                value={editedUser.email}
                onChange={handleChange('email')}
                fullWidth
                margin="normal"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Телефон"
                value={editedUser.phone}
                onChange={handleChange('phone')}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Отмена</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 