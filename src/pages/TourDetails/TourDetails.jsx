import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Rating,
  Avatar,
  Divider,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  AccessTime,
  Group,
  LocationOn,
  EventAvailable,
  Hotel,
  DirectionsBus,
  Restaurant,
  PhotoCamera,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import './TourDetails.css';

const mockTourData = {
  id: 1,
  title: 'Золотое кольцо России',
  description: 'Увлекательное путешествие по древним городам России, во время которого вы познакомитесь с историей и культурой нашей страны. Вы посетите уникальные памятники архитектуры, древние монастыри и храмы, узнаете о традициях и быте русского народа.',
  price: 45000,
  rating: 4.8,
  duration: 7,
  groupSize: '15-20',
  dates: ['2024-06-01', '2024-06-15', '2024-07-01'],
  location: 'Центральная Россия',
  images: [
    'https://images.unsplash.com/photo-1599824701954-d1d141704de9',
    'https://images.unsplash.com/photo-1588698947572-5563ebe0a0bf',
    'https://images.unsplash.com/photo-1588699219474-c95f23b59c26',
    'https://images.unsplash.com/photo-1588699219506-8c2f54c0aa8e',
  ],
  included: [
    'Проживание в отелях 4*',
    'Завтраки и ужины',
    'Транспортное обслуживание',
    'Экскурсии с гидом',
    'Входные билеты',
  ],
  schedule: [
    {
      day: 1,
      title: 'Сергиев Посад',
      description: 'Посещение Троице-Сергиевой лавры, обзорная экскурсия по городу.',
    },
    {
      day: 2,
      title: 'Переславль-Залесский',
      description: 'Осмотр достопримечательностей, посещение музея-усадьбы "Ботик Петра I".',
    },
    {
      day: 3,
      title: 'Ростов Великий',
      description: 'Экскурсия по Ростовскому кремлю, мастер-класс по росписи.',
    },
  ],
  reviews: [
    {
      id: 1,
      author: 'Анна Иванова',
      avatar: 'https://i.pravatar.cc/100?img=1',
      rating: 5,
      date: '2024-01-15',
      text: 'Прекрасный тур! Отличная организация, интересная программа. Особенно впечатлила Троице-Сергиева лавра.',
    },
    {
      id: 2,
      author: 'Петр Сидоров',
      avatar: 'https://i.pravatar.cc/100?img=2',
      rating: 4,
      date: '2024-01-10',
      text: 'Хороший маршрут, но хотелось бы больше свободного времени для самостоятельных прогулок.',
    },
  ],
};

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Здесь будет API запрос для получения данных тура
    setTour(mockTourData);
    setLoading(false);
  }, [id]);

  const handleBooking = () => {
    if (isAuthenticated) {
      navigate(`/booking/${id}`);
    } else {
      navigate('/auth');
    }
  };

  if (loading || !tour) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="tour-details">
      <Box className="tour-header">
        <Container>
          <Typography variant="h2" className="tour-title">
            {tour.title}
          </Typography>
          <Box className="tour-header-info">
            <Chip
              icon={<LocationOn />}
              label={tour.location}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<AccessTime />}
              label={`${tour.duration} дней`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Group />}
              label={`${tour.groupSize} человек`}
              color="primary"
              variant="outlined"
            />
            <Box className="tour-rating">
              <Rating value={tour.rating} precision={0.1} readOnly />
              <Typography variant="body2">
                {tour.rating} из 5
              </Typography>
            </Box>
            <Typography variant="h4" className="tour-price">
              {tour.price.toLocaleString()} ₽
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <ImageList variant="quilted" cols={4} rowHeight={200} className="tour-images">
              {tour.images.map((image, index) => (
                <ImageListItem
                  key={index}
                  cols={index === 0 ? 2 : 1}
                  rows={index === 0 ? 2 : 1}
                >
                  <img src={image} alt={`Тур ${index + 1}`} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>

            <Card className="tour-description-card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Описание тура
                </Typography>
                <Typography variant="body1" paragraph>
                  {tour.description}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  В стоимость включено:
                </Typography>
                <List>
                  {tour.included.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {index === 0 ? <Hotel /> :
                         index === 1 ? <Restaurant /> :
                         index === 2 ? <DirectionsBus /> :
                         index === 3 ? <PhotoCamera /> :
                         <EventAvailable />}
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            <Card className="tour-info-card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Программа тура
                </Typography>
                {tour.schedule.map((day, index) => (
                  <Box key={index} className="schedule-day">
                    <Typography variant="h6" gutterBottom>
                      День {day.day}: {day.title}
                    </Typography>
                    <Typography variant="body1">
                      {day.description}
                    </Typography>
                    {index < tour.schedule.length - 1 && <Divider className="day-divider" />}
                  </Box>
                ))}
              </CardContent>
            </Card>

            <Card className="tour-reviews-card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Отзывы
                </Typography>
                {tour.reviews.map((review) => (
                  <Box key={review.id} className="review-item">
                    <Box className="review-header">
                      <Box className="review-author">
                        <Avatar src={review.avatar} alt={review.author} />
                        <Box>
                          <Typography variant="subtitle1">
                            {review.author}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(review.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body1">
                      {review.text}
                    </Typography>
                    {review.id < tour.reviews.length && <Divider className="review-divider" />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="booking-card" sx={{ position: 'sticky', top: 24 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Забронировать тур
                </Typography>
                <Typography variant="body1" paragraph>
                  Ближайшие даты:
                </Typography>
                <List>
                  {tour.dates.map((date, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <EventAvailable color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={new Date(date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleBooking}
                  className="booking-button"
                >
                  Забронировать
                </Button>
                <Typography variant="body2" color="text.secondary" className="booking-note">
                  * Для бронирования необходима авторизация
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default TourDetails; 
 