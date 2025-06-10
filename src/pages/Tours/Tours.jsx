import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Button,
  Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Tours.css';

const mockTours = [
  {
    id: 1,
    title: 'Золотое кольцо России',
    description: 'Увлекательное путешествие по древним городам России',
    image: 'https://images.unsplash.com/photo-1599824701954-d1d141704de9',
    price: 45000,
    duration: 7,
    rating: 4.8,
    category: 'Культурный',
  },
  {
    id: 2,
    title: 'Байкал - Жемчужина Сибири',
    description: 'Незабываемое приключение на берегу священного озера',
    image: 'https://images.unsplash.com/photo-1551845041-63e8e76836ea',
    price: 89000,
    duration: 10,
    rating: 4.9,
    category: 'Природный',
  },
  {
    id: 3,
    title: 'Карелия - Край Тысячи Озер',
    description: 'Экологический тур по красивейшим местам Карелии',
    image: 'https://images.unsplash.com/photo-1543039625-14cbd3802e7d',
    price: 35000,
    duration: 5,
    rating: 4.7,
    category: 'Экологический',
  },
  // Добавьте больше туров по желанию
];

const Tours = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState(mockTours);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 100000],
    duration: 'all',
    sortBy: 'price',
  });
  const [page, setPage] = useState(1);
  const toursPerPage = 6;

  const categories = ['Все', 'Культурный', 'Природный', 'Экологический'];
  const durations = ['Все', '1-5 дней', '6-10 дней', '11+ дней'];

  useEffect(() => {
    // Здесь будет API запрос для получения туров
    filterTours();
  }, [filters]);

  const filterTours = () => {
    let filteredTours = [...mockTours];

    // Поиск по названию
    if (filters.search) {
      filteredTours = filteredTours.filter(tour =>
        tour.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Фильтр по категории
    if (filters.category !== 'all') {
      filteredTours = filteredTours.filter(tour => tour.category === filters.category);
    }

    // Фильтр по цене
    filteredTours = filteredTours.filter(
      tour => tour.price >= filters.priceRange[0] && tour.price <= filters.priceRange[1]
    );

    // Фильтр по длительности
    if (filters.duration !== 'all') {
      const [min, max] = filters.duration.split('-').map(Number);
      filteredTours = filteredTours.filter(tour => {
        if (max) {
          return tour.duration >= min && tour.duration <= max;
        }
        return tour.duration >= min;
      });
    }

    // Сортировка
    filteredTours.sort((a, b) => {
      if (filters.sortBy === 'price') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'duration') {
        return a.duration - b.duration;
      }
      return 0;
    });

    setTours(filteredTours);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleTourClick = (tourId) => {
    navigate(`/tour/${tourId}`);
  };

  return (
    <Container className="tours-container">
      <Typography variant="h4" className="page-title">
        Наши туры
      </Typography>

      <Box className="filters-section">
        <TextField
          label="Поиск тура"
          variant="outlined"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-field"
        />

        <FormControl className="filter-control">
          <InputLabel>Категория</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <MenuItem value="all">Все категории</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="filter-control">
          <InputLabel>Длительность</InputLabel>
          <Select
            value={filters.duration}
            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
          >
            <MenuItem value="all">Любая длительность</MenuItem>
            {durations.map((duration) => (
              <MenuItem key={duration} value={duration}>
                {duration}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="filter-control">
          <InputLabel>Сортировать по</InputLabel>
          <Select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <MenuItem value="price">Цене</MenuItem>
            <MenuItem value="rating">Рейтингу</MenuItem>
            <MenuItem value="duration">Длительности</MenuItem>
          </Select>
        </FormControl>

        <Box className="price-range">
          <Typography gutterBottom>Ценовой диапазон</Typography>
          <Slider
            value={filters.priceRange}
            onChange={(e, newValue) => setFilters({ ...filters, priceRange: newValue })}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={1000}
            valueLabelFormat={(value) => `${value.toLocaleString()} ₽`}
          />
          <Box className="price-labels">
            <Typography>{filters.priceRange[0].toLocaleString()} ₽</Typography>
            <Typography>{filters.priceRange[1].toLocaleString()} ₽</Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3} className="tours-grid">
        {tours
          .slice((page - 1) * toursPerPage, page * toursPerPage)
          .map((tour) => (
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
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {tour.description}
                  </Typography>
                  <Box className="tour-details">
                    <Typography variant="h6" color="secondary">
                      {tour.price.toLocaleString()} ₽
                    </Typography>
                    <Typography variant="body2">
                      {tour.duration} дней
                    </Typography>
                    <Typography variant="body2">
                      Рейтинг: {tour.rating}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleTourClick(tour.id)}
                  >
                    Подробнее
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Box className="pagination">
        <Pagination
          count={Math.ceil(tours.length / toursPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Tours; 