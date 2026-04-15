const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({ noCors: false });

const PORT = 3000;

function generateToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  const db = router.db;
  const user = db.get('users').find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
  }

  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json({
    user: userWithoutPassword,
    token: {
      accessToken: 'mock-jwt-' + generateToken(),
      refreshToken: 'mock-refresh-' + generateToken(),
      expiresIn: 3600,
    },
  });
});

server.post('/api/auth/register', (req, res) => {
  const { name, email, password, birthDate, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  const db = router.db;
  const existing = db.get('users').find({ email }).value();

  if (existing) {
    return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
  }

  const lastUser = db.get('users').sortBy('id').last().value();
  const newId = lastUser ? lastUser.id + 1 : 1;

  const newUser = { id: newId, name, email, password, birthDate, phone };
  db.get('users').push(newUser).write();

  const { password: _, ...userWithoutPassword } = newUser;

  return res.status(201).json({
    user: userWithoutPassword,
    token: {
      accessToken: 'mock-jwt-' + generateToken(),
      refreshToken: 'mock-refresh-' + generateToken(),
      expiresIn: 3600,
    },
  });
});

server.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório.' });
  }

  const db = router.db;
  const user = db.get('users').find({ email }).value();

  if (!user) {
    return res.status(200).json({
      message: 'Se o e-mail estiver cadastrado, você receberá as instruções.',
    });
  }

  const resetToken = generateToken();
  db.get('password-resets')
    .push({ id: Date.now(), email, token: resetToken, createdAt: new Date().toISOString() })
    .write();

  return res.status(200).json({
    message: 'Se o e-mail estiver cadastrado, você receberá as instruções.',
  });
});

server.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const db = router.db;
  const user = db.get('users').first().value();

  if (!user) {
    return res.status(401).json({ message: 'Usuário não encontrado.' });
  }

  const { password: _, ...userWithoutPassword } = user;
  return res.status(200).json(userWithoutPassword);
});

server.post('/api/auth/google', (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Credencial do Google é obrigatória.' });
  }

  let payload;
  try {
    const parts = credential.split('.');
    if (parts.length !== 3) throw new Error('Token inválido');
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
  } catch {
    return res.status(401).json({ message: 'Token do Google inválido.' });
  }

  const { email, name, sub: googleId } = payload;

  if (!email) {
    return res.status(401).json({ message: 'Token do Google não contém e-mail.' });
  }

  const db = router.db;
  let user = db.get('users').find({ email }).value();

  if (!user) {
    const lastUser = db.get('users').sortBy('id').last().value();
    const newId = lastUser ? lastUser.id + 1 : 1;

    user = { id: newId, name: name || email, email, password: null, googleId, birthDate: null, phone: null };
    db.get('users').push(user).write();
  }

  const { password: __, ...userWithoutPassword } = user;

  return res.status(200).json({
    user: userWithoutPassword,
    token: {
      accessToken: 'mock-jwt-' + generateToken(),
      refreshToken: 'mock-refresh-' + generateToken(),
      expiresIn: 3600,
    },
  });
});

server.use('/api', router);

server.listen(PORT, () => {});
