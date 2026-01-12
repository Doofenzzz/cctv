var token = "MASUKKAN_TOKEN_BOT_DISINI";
var SheetID = "MASUKKAN_SPREADSHEET_ID_DISINI";

// Kolom index (0-based)
var KOLOM = {
    DATE: 0,
    TIME: 1,
    PENGIRIM: 2,
    ID_SPV: 3,
    KKONTAK: 4,
    NIK: 5,
    NAMA: 6,
    NO_HP: 7,
    ALAMAT: 8,
    KELURAHAN: 9,
    KECAMATAN: 10,
    ODP: 11,
    TIKOR: 12,
    PAKET: 13,
    KETERANGAN: 14,
    EMAIL: 15
};

function doPost(e) {
    var stringJson = e.postData.getDataAsString();
    var data = JSON.parse(stringJson);

    if (data.message && data.message.text) {
        var text = data.message.text.trim();
        var chatId = data.message.chat.id;
        var sender = data.message.from;

        var response = prosesPerintah(text, sender);
        if (response) {
            sendText(chatId, response);
        }
    }
}

function prosesPerintah(text, sender) {
    // Cek apakah dimulai dengan /ID SPV:
    if (text.startsWith("/ID SPV:") || text.startsWith("/id spv:")) {
        return inputData(text, sender);
    }

    // Command bantuan
    if (text.toLowerCase() === "/help" || text.toLowerCase() === "/start") {
        return getHelpText();
    }

    // Command list data
    if (text.toLowerCase() === "/list") {
        return getListData();
    }

    // Command cari berdasarkan NIK
    if (text.toLowerCase().startsWith("/cari ")) {
        var keyword = text.substring(6).trim();
        return cariData(keyword);
    }

    return null; // Tidak merespon pesan biasa
}

function getHelpText() {
    return "📋 <b>Bot Input Data</b>\n\n" +
        "📝 <b>Cara Input Data:</b>\n" +
        "Copy format di bawah, isi datanya, lalu kirim:\n\n" +
        "<code>/ID SPV: @username\n" +
        "KKONTAK: \n" +
        "NIK: \n" +
        "NAMA: \n" +
        "NO HP: \n" +
        "ALAMAT: \n" +
        "KELURAHAN: \n" +
        "KECAMATAN: \n" +
        "ODP: \n" +
        "TIKOR: \n" +
        "PAKET: \n" +
        "KETERANGAN: \n" +
        "EMAIL: </code>\n\n" +
        "📊 <b>Command Lain:</b>\n" +
        "• <code>/list</code> - Lihat 10 data terakhir\n" +
        "• <code>/cari NIK</code> - Cari data berdasarkan NIK\n" +
        "• <code>/help</code> - Tampilkan bantuan";
}

function inputData(text, sender) {
    // Parse data dari text
    var lines = text.split("\n");
    var dataInput = {};

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        if (line.toLowerCase().startsWith("/id spv:")) {
            dataInput.ID_SPV = line.substring(8).trim();
        } else if (line.toUpperCase().startsWith("KKONTAK:")) {
            dataInput.KKONTAK = line.substring(8).trim();
        } else if (line.toUpperCase().startsWith("NIK:")) {
            dataInput.NIK = line.substring(4).trim();
        } else if (line.toUpperCase().startsWith("NAMA:")) {
            dataInput.NAMA = line.substring(5).trim();
        } else if (line.toUpperCase().startsWith("NO HP:")) {
            dataInput.NO_HP = line.substring(6).trim();
        } else if (line.toUpperCase().startsWith("ALAMAT:")) {
            dataInput.ALAMAT = line.substring(7).trim();
        } else if (line.toUpperCase().startsWith("KELURAHAN:")) {
            dataInput.KELURAHAN = line.substring(10).trim();
        } else if (line.toUpperCase().startsWith("KECAMATAN:")) {
            dataInput.KECAMATAN = line.substring(10).trim();
        } else if (line.toUpperCase().startsWith("ODP:")) {
            dataInput.ODP = line.substring(4).trim();
        } else if (line.toUpperCase().startsWith("TIKOR:")) {
            dataInput.TIKOR = line.substring(6).trim();
        } else if (line.toUpperCase().startsWith("PAKET:")) {
            dataInput.PAKET = line.substring(6).trim();
        } else if (line.toUpperCase().startsWith("KETERANGAN:")) {
            dataInput.KETERANGAN = line.substring(11).trim();
        } else if (line.toUpperCase().startsWith("EMAIL:")) {
            dataInput.EMAIL = line.substring(6).trim();
        }
    }

    // Validasi data minimal
    if (!dataInput.ID_SPV) {
        return "❌ <b>Error:</b> ID SPV tidak boleh kosong!\n\n" +
            "Format: <code>/ID SPV: @username</code>";
    }

    if (!dataInput.NIK) {
        return "❌ <b>Error:</b> NIK tidak boleh kosong!";
    }

    if (!dataInput.NAMA) {
        return "❌ <b>Error:</b> NAMA tidak boleh kosong!";
    }

    // Siapkan data otomatis
    var now = new Date();
    var timezone = Utilities.formatDate(now, "Asia/Jakarta", "dd/MM/yyyy");
    var timeNow = Utilities.formatDate(now, "Asia/Jakarta", "HH:mm:ss");

    // Nama pengirim dari Telegram
    var namaPengirim = sender.first_name || "";
    if (sender.last_name) {
        namaPengirim += " " + sender.last_name;
    }
    if (sender.username) {
        namaPengirim += " (@" + sender.username + ")";
    }

    // Siapkan row data (16 kolom)
    var rowData = [
        timezone,                       // A: Date
        timeNow,                        // B: Time
        namaPengirim,                   // C: Pengirim
        dataInput.ID_SPV || "",         // D: ID SPV
        dataInput.KKONTAK || "",        // E: KKONTAK
        dataInput.NIK || "",            // F: NIK
        dataInput.NAMA || "",           // G: NAMA
        dataInput.NO_HP || "",          // H: NO HP
        dataInput.ALAMAT || "",         // I: ALAMAT
        dataInput.KELURAHAN || "",      // J: KELURAHAN
        dataInput.KECAMATAN || "",      // K: KECAMATAN
        dataInput.ODP || "",            // L: ODP
        dataInput.TIKOR || "",          // M: TIKOR
        dataInput.PAKET || "",          // N: PAKET
        dataInput.KETERANGAN || "",     // O: KETERANGAN
        dataInput.EMAIL || ""           // P: EMAIL
    ];

    // Simpan ke spreadsheet
    try {
        var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("Sheet1");
        sheet.appendRow(rowData);

        return "✅ <b>Data Berhasil Disimpan!</b>\n\n" +
            "Terimakasih " + dataInput.ID_SPV + " !\n\n" +
            "📅 Tanggal: " + timezone + "\n" +
            "🕐 Jam: " + timeNow + "\n" +
            "👤 Nama: " + dataInput.NAMA + "\n" +
            "🆔 NIK: " + dataInput.NIK;

    } catch (error) {
        return "❌ <b>Error menyimpan data:</b>\n" + error.message;
    }
}

function getListData() {
    try {
        var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("Sheet1");
        var data = sheet.getDataRange().getValues();

        if (data.length <= 1) {
            return "📭 Belum ada data.";
        }

        // Ambil 10 data terakhir
        var startRow = Math.max(1, data.length - 10);
        var result = "📊 <b>10 Data Terakhir:</b>\n\n";

        for (var i = data.length - 1; i >= startRow; i--) {
            result += "• <code>" + data[i][KOLOM.NIK] + "</code> - " +
                data[i][KOLOM.NAMA] + " (" + data[i][KOLOM.DATE] + ")\n";
        }

        return result;

    } catch (error) {
        return "❌ Error: " + error.message;
    }
}

function cariData(keyword) {
    try {
        var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("Sheet1");
        var data = sheet.getDataRange().getValues();

        for (var i = 1; i < data.length; i++) {
            if (data[i][KOLOM.NIK] == keyword) {
                return "📋 <b>Data Ditemukan:</b>\n\n" +
                    "📅 Tanggal: " + data[i][KOLOM.DATE] + "\n" +
                    "🕐 Jam: " + data[i][KOLOM.TIME] + "\n" +
                    "👤 Pengirim: " + data[i][KOLOM.PENGIRIM] + "\n" +
                    "🏷️ ID SPV: " + data[i][KOLOM.ID_SPV] + "\n" +
                    "📞 KKONTAK: " + data[i][KOLOM.KKONTAK] + "\n" +
                    "🆔 NIK: " + data[i][KOLOM.NIK] + "\n" +
                    "👤 NAMA: " + data[i][KOLOM.NAMA] + "\n" +
                    "📱 NO HP: " + data[i][KOLOM.NO_HP] + "\n" +
                    "🏠 ALAMAT: " + data[i][KOLOM.ALAMAT] + "\n" +
                    "📍 KELURAHAN: " + data[i][KOLOM.KELURAHAN] + "\n" +
                    "📍 KECAMATAN: " + data[i][KOLOM.KECAMATAN] + "\n" +
                    "📡 ODP: " + data[i][KOLOM.ODP] + "\n" +
                    "📌 TIKOR: " + data[i][KOLOM.TIKOR] + "\n" +
                    "📦 PAKET: " + data[i][KOLOM.PAKET] + "\n" +
                    "📝 KETERANGAN: " + data[i][KOLOM.KETERANGAN] + "\n" +
                    "📧 EMAIL: " + data[i][KOLOM.EMAIL];
            }
        }

        return "❌ Data dengan NIK <code>" + keyword + "</code> tidak ditemukan.";

    } catch (error) {
        return "❌ Error: " + error.message;
    }
}

function sendText(chatid, text, replymarkup) {
    var data = {
        method: "POST",
        payload: {
            method: "sendMessage",
            chat_id: String(chatid),
            text: text,
            parse_mode: "HTML",
            reply_markup: JSON.stringify(replymarkup)
        }
    }
    UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/", data);
}
