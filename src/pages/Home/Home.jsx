import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import './Home.css';

const featuredTours = [
  {
    id: 1,
    title: 'Золотое кольцо России',
    description: 'Увлекательное путешествие по древним городам России',
    image: 'https://images.unsplash.com/photo-1599824701954-d1d141704de9',
    price: 45000,
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Байкал - Жемчужина Сибири',
    description: 'Незабываемое приключение на берегу священного озера',
    image: 'https://images.unsplash.com/photo-1551845041-63e8e76836ea',
    price: 89000,
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Карелия - Край Тысячи Озер',
    description: 'Экологический тур по красивейшим местам Карелии',
    image: 'https://images.unsplash.com/photo-1543039625-14cbd3802e7d',
    price: 35000,
    rating: 4.7,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    destination: '',
    date: null,
    duration: '',
    budget: '',
  });

  const handleSearch = (event) => {
    event.preventDefault();
    navigate('/tours', { state: { searchParams } });
  };

  const handleTourClick = (tourId) => {
    navigate(`/tours/${tourId}`);
  };

  return (
    <div className="home">
      <Box className="hero-section">
        <Container>
          <Typography variant="h1" className="hero-title">
            Откройте Россию вместе с нами
          </Typography>
          <Typography variant="h5" className="hero-subtitle">
            Незабываемые путешествия по самым красивым местам нашей страны
          </Typography>

          <Card className="search-card">
            <CardContent>
              <form onSubmit={handleSearch}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Куда хотите поехать?"
                      fullWidth
                      value={searchParams.destination}
                      onChange={(e) =>
                        setSearchParams({ ...searchParams, destination: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                      <DatePicker
                        label="Когда"
                        value={searchParams.date}
                        onChange={(date) =>
                          setSearchParams({ ...searchParams, date })
                        }
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Длительность</InputLabel>
                      <Select
                        value={searchParams.duration}
                        onChange={(e) =>
                          setSearchParams({ ...searchParams, duration: e.target.value })
                        }
                      >
                        <MenuItem value="">Любая</MenuItem>
                        <MenuItem value="1-5">1-5 дней</MenuItem>
                        <MenuItem value="6-10">6-10 дней</MenuItem>
                        <MenuItem value="11+">11+ дней</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Бюджет</InputLabel>
                      <Select
                        value={searchParams.budget}
                        onChange={(e) =>
                          setSearchParams({ ...searchParams, budget: e.target.value })
                        }
                      >
                        <MenuItem value="">Любой</MenuItem>
                        <MenuItem value="0-50000">до 50 000 ₽</MenuItem>
                        <MenuItem value="50000-100000">50 000 - 100 000 ₽</MenuItem>
                        <MenuItem value="100000+">от 100 000 ₽</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  className="search-button"
                >
                  Найти тур
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>

      <Container>
        <section className="featured-section">
          <Typography variant="h2" className="section-title">
            Популярные направления
          </Typography>
          <Grid container spacing={4}>
            {featuredTours.map((tour) => (
              <Grid item xs={12} sm={6} md={4} key={tour.id}>
                <Card
                  className="tour-card"
                  onClick={() => handleTourClick(tour.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={tour.image}
                    alt={tour.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {tour.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {tour.description}
                    </Typography>
                    <Box className="tour-footer">
                      <Typography variant="h6" color="primary">
                        {tour.price.toLocaleString()} ₽
                      </Typography>
                      <Rating value={tour.rating} precision={0.1} readOnly />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </section>

        <section className="advantages-section">
          <Typography variant="h2" className="section-title">
            Почему выбирают нас
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="advantage-item">
                <Typography variant="h3" className="advantage-number">
                  10+
                </Typography>
                <Typography variant="h6">лет опыта</Typography>
                <Typography variant="body2" color="text.secondary">
                  Организуем путешествия с 2013 года
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="advantage-item">
                <Typography variant="h3" className="advantage-number">
                  1000+
                </Typography>
                <Typography variant="h6">довольных клиентов</Typography>
                <Typography variant="body2" color="text.secondary">
                  Положительные отзывы и рекомендации
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="advantage-item">
                <Typography variant="h3" className="advantage-number">
                  50+
                </Typography>
                <Typography variant="h6">направлений</Typography>
                <Typography variant="body2" color="text.secondary">
                  Уникальные маршруты по всей России
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box className="advantage-item">
                <Typography variant="h3" className="advantage-number">
                  24/7
                </Typography>
                <Typography variant="h6">поддержка</Typography>
                <Typography variant="body2" color="text.secondary">
                  Всегда на связи с клиентами
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </section>
      </Container>
    </div>
  );
};

export default Home; 