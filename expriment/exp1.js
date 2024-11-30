import bcryptjs from 'bcryptjs';

async function hashPassword() {
  const value = await bcryptjs.hash("hashedpassword123", 10);
  console.log(value);
}

hashPassword();
