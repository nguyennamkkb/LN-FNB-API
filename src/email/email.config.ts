export default {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || 'lnquanlynhahang@gmail.com',
    pass: process.env.SMTP_PASS || 'hwmi vnil xzok qphe',
  };