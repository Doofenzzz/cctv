var token = "";
var SheetID = "";

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
    // Cek apakah dimulai dengan /ID SPV (dengan flexible spacing sebelum :)
    var lowerText = text.toLowerCase();
    if (lowerText.startsWith("/id spv")) {
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

    // Helper function untuk parse field dengan flexible spacing
    // Bisa handle: "NIK:", "NIK :", "NIK  :", dll
    function parseField(line, fieldName) {
        var upperLine = line.toUpperCase();
        var pattern = fieldName.toUpperCase();

        // Cek apakah dimulai dengan fieldName (dengan atau tanpa spasi sebelum :)
        if (upperLine.startsWith(pattern)) {
            var rest = line.substring(pattern.length).trim();
            if (rest.startsWith(":")) {
                return rest.substring(1).trim();
            }
        }
        return null;
    }

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        var value;

        // ID SPV (special case karena ada slash)
        if (line.toLowerCase().startsWith("/id spv")) {
            var rest = line.substring(7).trim();
            if (rest.startsWith(":")) {
                dataInput.ID_SPV = rest.substring(1).trim();
            }
        }
        else if ((value = parseField(line, "KKONTAK")) !== null) {
            dataInput.KKONTAK = value;
        }
        else if ((value = parseField(line, "NIK")) !== null) {
            dataInput.NIK = value;
        }
        else if ((value = parseField(line, "NAMA")) !== null) {
            dataInput.NAMA = value;
        }
        else if ((value = parseField(line, "NO HP")) !== null) {
            dataInput.NO_HP = value;
        }
        else if ((value = parseField(line, "ALAMAT")) !== null) {
            dataInput.ALAMAT = value;
        }
        else if ((value = parseField(line, "KELURAHAN")) !== null) {
            dataInput.KELURAHAN = value;
        }
        else if ((value = parseField(line, "KECAMATAN")) !== null) {
            dataInput.KECAMATAN = value;
        }
        else if ((value = parseField(line, "ODP")) !== null) {
            dataInput.ODP = value;
        }
        else if ((value = parseField(line, "TIKOR")) !== null) {
            dataInput.TIKOR = value;
        }
        else if ((value = parseField(line, "PAKET")) !== null) {
            dataInput.PAKET = value;
        }
        else if ((value = parseField(line, "KETERANGAN")) !== null) {
            dataInput.KETERANGAN = value;
        }
        else if ((value = parseField(line, "EMAIL")) !== null) {
            dataInput.EMAIL = value;
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
            "Terimakasih " + dataInput.ID_SPV + " !\n\n"

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
