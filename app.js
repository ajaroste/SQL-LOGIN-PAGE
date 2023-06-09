const express = require('express');
const sql = require("mssql/msnodesqlv8");

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
const config = {
    database: "LOGINDB",//Bu database services.bat tarafından otomatik oluşturulur
    server: "EMINE",//SQL server ismini yazınız!!
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
};

// Ana sayfa için GET isteği
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');;
});
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});
app.get('/user/:username', async (req, res) => {
    const username = req.params.username;
    res.sendFile(__dirname + '/user.html');
});
// Form verilerini işlemek için POST isteği (Register)
app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    try {
        const pool = await sql.connect(config);
        const selectResult = await pool.request()
            .query('SELECT MAX(KODU) AS MaxKodu FROM LOGIN');

        let maxKodu = selectResult.recordset[0].MaxKodu;
        let kodu;

        // Yeni kodu oluştur/ Bu kısımda otomatik KODU kısmı oluşturulur 
        if (maxKodu) {
            const maxKoduNumber = parseInt(maxKodu);
            kodu = (maxKoduNumber + 1).toString().padStart(4, '0');
        } else {
            kodu = '0001';
        }

        // Giriş değerlerini kontrol et
        if (!username || !password || !email) {
            res.status(400).send('Geçersiz giriş değerleri.');
            return;
        }

        const checkResult = await pool.request()
            .input('email', sql.VarChar(50), email)
            .query('SELECT * FROM LOGIN WHERE EMAIL = @email');

        if (checkResult.recordset.length > 0) {
            res.send('Bu kullanıcı adı zaten kullanılmış.');
        } else {
            const insertResult = await pool.request()
                .input('email', sql.VarChar(50), email)
                .input('username', sql.VarChar(50), username)
                .input('password', sql.VarChar(50), password)
                .input('kodu', sql.VarChar(50), kodu)
                .query('INSERT INTO LOGIN (EMAIL, password, username, kodu) VALUES (@email, @password, @username, @kodu)');

            res.send('Kayıt başarıyla tamamlandı. Artık giriş yapabilirsiniz.');
        }
    } catch (error) {
        console.log('Hata:', error);
        res.status(500).send('Bir Hata oluştu. Lütfen tekrar deneyin.');
    }




    
});
// Form verilerini işlemek için POST isteği (Login)
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Giriş değerlerini kontrol et
    if (!email || !password) {
        res.status(400).send('Geçersiz giriş değerleri.');
        return;
    }

    try {
        console.log(email + password) 
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('email', sql.VarChar(50), email)
            .input('password', sql.VarChar(50), password)
            .query('SELECT * FROM LOGIN WHERE EMAIL = @email AND password = @password');

        if (result.recordset.length > 0) {
            res.send('Giriş başarılı,Admin sayfasına erişmek için Tıkla:');
        } else {
            res.send('Kullanıcı adı veya şifre hatalı.');
        }
    } catch (error) {
        console.log('Hata:', error);
        res.status(500).send('Bir Hata oluştu. Lütfen tekrar deneyin.');
    }
});
console.log("http://localhost:8080/ ile Bağlantı sağlıyabilirsiniz")
const port = 8080;

app.listen(port, () => {
});
