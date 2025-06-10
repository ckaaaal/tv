import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import './Booking.css';

const steps = ['Выбор даты', 'Информация о туристах', 'Подтверждение'];

const mockTourData = {
  id: 1,
  title: 'Золотое кольцо России',
  price: 45000,
  duration: 7,
  dates: [
    '2024-06-01',
    '2024-06-15',
    '2024-07-01',
    '2024-07-15',
    '2024-08-01',
  ],
};

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [tour, setTour] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: null,
    tourists: [
      {
        firstName: '',
        lastName: '',
        birthDate: null,
        passport: '',
        phone: '',
      },
    ],
    totalPrice: 0,
  });

  useEffect(() => {
    // Здесь будет API запрос для получения данных тура
    setTour(mockTourData);
    setBookingData(prev => ({
      ...prev,
      totalPrice: mockTourData.price,
    }));
  }, [id]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleDateChange = (date) => {
    setBookingData(prev => ({
      ...prev,
      date,
    }));
  };

  const handleTouristChange = (index, field, value) => {
    const newTourists = [...bookingData.tourists];
    newTourists[index] = {
      ...newTourists[index],
      [field]: value,
    };
    setBookingData(prev => ({
      ...prev,
      tourists: newTourists,
    }));
  };

  const addTourist = () => {
    setBookingData(prev => ({
      ...prev,
      tourists: [
        ...prev.tourists,
        {
          firstName: '',
          lastName: '',
          birthDate: null,
          passport: '',
          phone: '',
        },
      ],
      totalPrice: prev.totalPrice + tour.price,
    }));
  };

  const removeTourist = (index) => {
    if (bookingData.tourists.length > 1) {
      const newTourists = bookingData.tourists.filter((_, i) => i !== index);
      setBookingData(prev => ({
        ...prev,
        tourists: newTourists,
        totalPrice: prev.totalPrice - tour.price,
      }));
    }
  };

  const handleSubmit = () => {
    // Здесь будет API запрос для отправки данных бронирования
    console.log('Отправка данных бронирования:', bookingData);
    navigate('/profile');
  };

  if (!tour) {
    return <div>Загрузка...</div>;
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="step-content">
            <Typography variant="h6" gutterBottom>
              Выберите дату начала тура
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <DatePicker
                label="Дата"
                value={bookingData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
                shouldDisableDate={(date) => !tour.dates.includes(date.toISOString().split('T')[0])}
              />
            </LocalizationProvider>
          </Box>
        );

      case 1:
        return (
          <Box className="step-content">
            <Typography variant="h6" gutterBottom>
              Информация о туристах
            </Typography>
            {bookingData.tourists.map((tourist, index) => (
              <Card key={index} className="tourist-card">
                <CardContent>
                  <Box className="tourist-header">
                    <Typography variant="h6">Турист {index + 1}</Typography>
                    {index > 0 && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeTourist(index)}
                      >
                        Удалить
                      </Button>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Имя"
                        value={tourist.firstName}
                        onChange={(e) => handleTouristChange(index, 'firstName', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Фамилия"
                        value={tourist.lastName}
                        onChange={(e) => handleTouristChange(index, 'lastName', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                        <DatePicker
                          label="Дата рождения"
                          value={tourist.birthDate}
                          onChange={(date) => handleTouristChange(index, 'birthDate', date)}
                          renderInput={(params) => <TextField {...params} fullWidth required />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Номер паспорта"
                        value={tourist.passport}
                        onChange={(e) => handleTouristChange(index, 'passport', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Телефон"
                        value={tourist.phone}
                        onChange={(e) => handleTouristChange(index, 'phone', e.target.value)}
                        fullWidth
                        required
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={addTourist}
              className="add-tourist-button"
            >
              Добавить туриста
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box className="step-content">
            <Typography variant="h6" gutterBottom>
              Подтверждение бронирования
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {tour.title}
                </Typography>
                <Typography>
                  Дата начала: {bookingData.date?.toLocaleDateString('ru-RU')}
                </Typography>
                <Typography>
                  Количество туристов: {bookingData.tourists.length}
                </Typography>
                <Typography variant="h6" color="secondary" className="total-price">
                  Итоговая стоимость: {bookingData.totalPrice.toLocaleString()} ₽
                </Typography>
                <Alert severity="info" className="booking-info">
                  Пожалуйста, проверьте все данные перед подтверждением бронирования.
                  После подтверждения наш менеджер свяжется с вами для уточнения деталей.
                </Alert>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container className="booking-container">
      <Typography variant="h4" className="page-title">
        Бронирование тура
      </Typography>

      <Stepper activeStep={activeStep} className="booking-stepper">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {getStepContent(activeStep)}

      <Box className="booking-actions">
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          className="back-button"
        >
          Назад
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        >
          {activeStep === steps.length - 1 ? 'Подтвердить бронирование' : 'Далее'}
        </Button>
      </Box>
    </Container>
  );
};

export default Booking; 