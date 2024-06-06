export const EMAIL_TEMPLATES = {
  welcome: {
    subject: 'Bienvenido a bordo #name!',
    html: '<p>Hola #name,</p><p>Bienvenido a <b>ExplitApp</b> tu fiel aliado para repartir gastos de foma rápida y sencilla. Entra ya a <a href="http://localhost:4200/landing">ExplitApp</a>',
  },
  invitation: {
    subject: '',
    html: '<p>Hola #frindsName,</p> <p>tu amigo #name te ha invitado a unirte a su grupo en ExplitApp. únete a él siguiendo este <a href="http://localhost:4200/landing">enlace</a></p>',
  },
  passwordRecovery: {
    subject: '',
    html: '',
  },
};
