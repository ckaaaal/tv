import {
  Container,
  Grid,
  Typography,
  Link,
  Box,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-title">
              ТурВояж
            </Typography>
            <Typography variant="body2" className="footer-description">
              Ваш надежный партнер в мире путешествий по России. Мы делаем ваш отдых незабываемым!
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-title">
              Контакты
            </Typography>
            <Box className="contact-item">
              <Phone fontSize="small" />
              <Link href="tel:+78001234567" color="inherit">
                8 (800) 123-45-67
              </Link>
            </Box>
            <Box className="contact-item">
              <Email fontSize="small" />
              <Link href="mailto:info@turvoyage.ru" color="inherit">
                info@turvoyage.ru
              </Link>
            </Box>
            <Box className="contact-item">
              <LocationOn fontSize="small" />
              <Typography variant="body2">
                г. Москва, ул. Туристская, 1
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-title">
              Навигация
            </Typography>
            <Box className="nav-links">
              <Link component={RouterLink} to="/" color="inherit">
                Главная
              </Link>
              <Link component={RouterLink} to="/tours" color="inherit">
                Туры
              </Link>
              <Link component={RouterLink} to="/auth" color="inherit">
                Личный кабинет
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="footer-title">
              Мы в соцсетях
            </Typography>
            <Box className="social-links">
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box className="footer-bottom">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} ТурВояж. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer; 