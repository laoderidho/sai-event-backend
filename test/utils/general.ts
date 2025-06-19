export function generateRandomEmail(name?: string): string {
    const random = Math.floor(Math.random() * 10000);
    const username = name?.toLowerCase().replace(/\s/g, '') || "user";
    return `${username}${random}@example.com`;
  }
export function generateRandomPhoneNumber(): string {
    const prefix = "628"; // bisa disesuaikan (Indonesia)
    const number = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
    return `${prefix}${number}`;
  }
export function generateRandomPassword(length: number = 10): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
 export function generateRandomName() {
    const firstNames = [
        "Ridho", "Andi", "Siti", "Budi", "Dewi", "Rina", "Agus", "Lina", "Putri", "Joko",
        "Bayu", "Ayu", "Dian", "Tono", "Wulan", "Rizki", "Yuli", "Hendra", "Nina", "Tari",
        "Riko", "Indah", "Taufik", "Mega", "Fajar", "Citra", "Imam", "Desi", "Yoga", "Lusi"
    ];
      
    const lastNames = [
        "Fahreza", "Putra", "Wati", "Saputra", "Rahma", "Pratama", "Wijaya", "Susanto", "Siregar", "Santoso",
        "Yuliani", "Anugrah", "Permadi", "Maulana", "Gunawan", "Surya", "Kusuma", "Nugroho", "Kurniawan", "Wibowo",
        "Setiawan", "Azhari", "Iskandar", "Salim", "Hamzah", "Basri", "Ardiansyah", "Mahendra", "Hermawan", "Hakim"
      ];
      
  
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  
    return `${first} ${last}`;
  }
