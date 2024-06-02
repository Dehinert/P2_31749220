require('dotenv').config()
const ContactosModel = require("../models/ContactosModel.js");
const nodemailer = require("nodemailer");

class ContactosController {
  constructor() {
    this.contactosModel = new ContactosModel();
    this.add = this.add.bind(this);
  }

  async obtenerIp() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip; // Retorna la ip
    } catch (error) {
      console.error('Error al obtener la ip:', error);
      return null; // Retorna null si hay un error
    }
  }

  async obtenerPais(ip) {
    try {
      const response = await fetch('https://ipinfo.io/'+ip+'?token=cb85ccdd0e958e');
      const data = await response.json();
      return data.country; // Retorna el país
    } catch (error) {
      console.error('Error al obtener el país:', error);
      return null; // Retorna null si hay un error
    }
  }

  async add(req, res) {
    // Validar los datos del formulario

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Use port 465 for SSL
      secure: true, // Set to true for SSL
      auth: {
        user: process.env.CORREO,
        pass: process.env.PASSWORD,
      },
    });
    
    const sendTemplate = {
      from:process.env.CORREO, 
      to: [process.env.CORREOREC1, process.env.CORREOREC2],
      subject: "probando el envio del correo",
      text:  `Nombre: ${req.body.name} | Comentario: ${req.body.mensaje}
      } | Email: ${req.body.email} | Date: ${new Date()}`
    };

    transporter.sendMail(sendTemplate, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });


    const { email, name, mensaje } = req.body;

    if (!email || !name || !mensaje) {
      res.status(400).send("Faltan campos requeridos");
      return;
    }

    // Guardar los datos del formulario
    const ip = await this.obtenerIp();
    const fecha = new Date().toISOString();
    const pais = await this.obtenerPais(ip)

   
    await this.contactosModel.crearContacto(email, name, mensaje, ip, fecha, pais);

    const contactos = await this.contactosModel.obtenerAllContactos();

    console.log(contactos);

    res.send("se ha enviado todos los datos correctamente");
    
  }
}

module.exports = ContactosController;