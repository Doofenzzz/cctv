var token = "8363218288:AAEaA33agO5SqoEUgwTFMZLeZ-UMKHzZmxg";
var SheetID = "1Ev7vqbRwB_jedtzZLWFI3CwJw0XAlaS63j52e-ox8Ok";

// Kolom index (0-based): A=0 (ID), B=1 (Nama), C=2 (Lokasi)
var KOLOM = {
    ID: 0,
    NAMA: 1,
    LOKASI: 2
};

function doPost(e) {
    var stringJson = e.postData.getDataAsString();
    var data = JSON.parse(stringJson);

    if (data.message && data.message.text) {
        var text = data.message.text.trim();
        var chatId = data.message.chat.id;
        var response = prosesPerintah(text);
        sendText(chatId, response);
    }
}

function prosesPerintah(text) {
    // Cek apakah ada command
    if (text.startsWith("/")) {
        var parts = text.split(" ");
        var command = parts[0].toLowerCase();
        var idBarang = parts.slice(1).join(" ");

        switch (command) {
            case "/nama":
                return cariField(idBarang, KOLOM.NAMA);
            case "/lokasi":
                return cariField(idBarang, KOLOM.LOKASI);
            case "/semua":
                return cariSemuaField(idBarang);
            case "/help":
            case "/start":
                return getHelpText();
            case "/list":
                return getListBarang();
            case "/tambah":
                return tambahBarang(idBarang);
            case "/update":
                return updateBarang(idBarang);
            case "/hapus":
                return hapusBarang(idBarang);
            default:
                return "❌ Command tidak dikenal.\n\n" + getHelpText();
        }
    } else {
        // Kalau bukan command, cari semua field
        return cariSemuaField(text);
    }
}

function getHelpText() {
    return "📦 <b>Bot Inventaris Barang</b>\n\n" +
        "📋 <b>Baca Data:</b>\n" +
        "• Ketik <code>ID_BARANG</code> - Info lengkap\n" +
        "• <code>/nama ID</code> - Nama barang saja\n" +
        "• <code>/lokasi ID</code> - Lokasi saja\n" +
        "• <code>/list</code> - Daftar semua barang\n\n" +
        "✏️ <b>Tulis Data:</b>\n" +
        "• <code>/tambah ID|Nama|Lokasi</code>\n" +
        "• <code>/update ID|Nama|Lokasi</code>\n" +
        "• <code>/hapus ID</code>\n\n" +
        "📝 <b>Contoh:</b>\n" +
        "<code>/tambah BRG004|Printer HP|Gudang C</code>\n" +
        "<code>/update BRG001|Laptop Lenovo|Rak 5</code>\n" +
        "<code>/hapus BRG004</code>";
}

function getListBarang() {
    var dataBarang = AmbilSheet1();
    if (!dataBarang || dataBarang.length === 0) {
        return "📭 Tidak ada barang di database.";
    }

    var result = "📦 <b>Daftar Barang:</b>\n\n";
    for (var row = 0; row < dataBarang.length; row++) {
        result += "• <code>" + dataBarang[row][KOLOM.ID] + "</code> - " + dataBarang[row][KOLOM.NAMA] + "\n";
    }
    return result;
}

function cariField(idBarang, kolomIndex) {
    if (!idBarang) {
        return "❌ Masukkan ID barang!\nContoh: <code>/nama BRG001</code>";
    }

    var dataBarang = AmbilSheet1();
    for (var row = 0; row < dataBarang.length; row++) {
        if (dataBarang[row][KOLOM.ID] == idBarang) {
            return "✅ " + dataBarang[row][kolomIndex];
        }
    }

    // Cari di Sheet2 juga
    try {
        var dataBarang2 = AmbilSheet2();
        for (var row = 0; row < dataBarang2.length; row++) {
            if (dataBarang2[row][KOLOM.ID] == idBarang) {
                return "✅ " + dataBarang2[row][kolomIndex];
            }
        }
    } catch (e) {
        // Sheet2 tidak ada, lanjut
    }

    return "❌ Barang dengan ID <code>" + idBarang + "</code> tidak ditemukan.";
}

function cariSemuaField(idBarang) {
    if (!idBarang) {
        return getHelpText();
    }

    var dataBarang = AmbilSheet1();
    for (var row = 0; row < dataBarang.length; row++) {
        if (dataBarang[row][KOLOM.ID] == idBarang) {
            return "📦 <b>Info Barang</b>\n\n" +
                "🆔 ID: <code>" + dataBarang[row][KOLOM.ID] + "</code>\n" +
                "📝 Nama: " + dataBarang[row][KOLOM.NAMA] + "\n" +
                "📍 Lokasi: " + dataBarang[row][KOLOM.LOKASI];
        }
    }

    // Cari di Sheet2 juga
    try {
        var dataBarang2 = AmbilSheet2();
        for (var row = 0; row < dataBarang2.length; row++) {
            if (dataBarang2[row][KOLOM.ID] == idBarang) {
                return "📦 <b>Info Barang</b>\n\n" +
                    "🆔 ID: <code>" + dataBarang2[row][KOLOM.ID] + "</code>\n" +
                    "📝 Nama: " + dataBarang2[row][KOLOM.NAMA] + "\n" +
                    "📍 Lokasi: " + dataBarang2[row][KOLOM.LOKASI];
            }
        }
    } catch (e) {
        // Sheet2 tidak ada, lanjut
    }

    return "❌ Barang dengan ID <code>" + idBarang + "</code> tidak ditemukan.";
}

// ==================== FUNGSI WRITE ====================

function tambahBarang(params) {
    if (!params) {
        return "❌ Format salah!\n\n" +
            "<b>Cara pakai:</b>\n" +
            "<code>/tambah ID|Nama|Lokasi</code>\n\n" +
            "<b>Contoh:</b>\n" +
            "<code>/tambah BRG004|Printer HP|Gudang C</code>";
    }

    var parts = params.split("|");
    if (parts.length !== 3) {
        return "❌ Format salah! Harus ada 3 bagian dipisah dengan |\n\n" +
            "<b>Format:</b> <code>/tambah ID|Nama|Lokasi</code>";
    }

    var id = parts[0].trim();
    var nama = parts[1].trim();
    var lokasi = parts[2].trim();

    // Cek apakah ID sudah ada
    var dataBarang = AmbilSheet1();
    if (dataBarang) {
        for (var row = 0; row < dataBarang.length; row++) {
            if (dataBarang[row][KOLOM.ID] == id) {
                return "❌ Barang dengan ID <code>" + id + "</code> sudah ada!\n" +
                    "Gunakan <code>/update</code> untuk mengubah data.";
            }
        }
    }

    // Tambah ke spreadsheet
    var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("Sheet1");
    sheet.appendRow([id, nama, lokasi]);

    return "✅ <b>Barang berhasil ditambahkan!</b>\n\n" +
        "🆔 ID: <code>" + id + "</code>\n" +
        "📝 Nama: " + nama + "\n" +
        "📍 Lokasi: " + lokasi;
}

function updateBarang(params) {
    if (!params) {
        return "❌ Format salah!\n\n" +
            "<b>Cara pakai:</b>\n" +
            "<code>/update ID|Nama|Lokasi</code>\n\n" +
            "<b>Contoh:</b>\n" +
            "<code>/update BRG001|Laptop Lenovo|Rak 5</code>";
    }

    var parts = params.split("|");
    if (parts.length !== 3) {
        return "❌ Format salah! Harus ada 3 bagian dipisah dengan |\n\n" +
            "<b>Format:</b> <code>/update ID|Nama|Lokasi</code>";
    }

    var id = parts[0].trim();
    var nama = parts[1].trim();
    var lokasi = parts[2].trim();

    // Cari dan update di Sheet1
    var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("Sheet1");
    var data = sheet.getDataRange().getValues();

    for (var row = 1; row < data.length; row++) { // mulai dari 1 (skip header)
        if (data[row][KOLOM.ID] == id) {
            sheet.getRange(row + 1, 2).setValue(nama);   // Kolom B (Nama)
            sheet.getRange(row + 1, 3).setValue(lokasi); // Kolom C (Lokasi)

            return "✅ <b>Barang berhasil diupdate!</b>\n\n" +
                "🆔 ID: <code>" + id + "</code>\n" +
                "📝 Nama: " + nama + "\n" +
                "📍 Lokasi: " + lokasi;
        }
    }

    return "❌ Barang dengan ID <code>" + id + "</code> tidak ditemukan.";
}

function hapusBarang(idBarang) {
    if (!idBarang) {
        return "❌ Masukkan ID barang yang mau dihapus!\n\n" +
            "<b>Contoh:</b> <code>/hapus BRG004</code>";
    }

    var sheet = SpreadsheetApp.openById(SheetID).getSheetByName("Sheet1");
    var data = sheet.getDataRange().getValues();

    for (var row = 1; row < data.length; row++) { // mulai dari 1 (skip header)
        if (data[row][KOLOM.ID] == idBarang) {
            var namaBarang = data[row][KOLOM.NAMA];
            sheet.deleteRow(row + 1);

            return "✅ <b>Barang berhasil dihapus!</b>\n\n" +
                "🆔 ID: <code>" + idBarang + "</code>\n" +
                "📝 Nama: " + namaBarang;
        }
    }

    return "❌ Barang dengan ID <code>" + idBarang + "</code> tidak ditemukan.";
}

function AmbilSheet1() {
    var rangeName = 'Sheet1!A2:C'
    var rows = Sheets.Spreadsheets.Values.get(SheetID, rangeName).values;
    return rows;
}

function AmbilSheet2() {
    var rangeName = 'Sheet2!A2:C'
    var rows = Sheets.Spreadsheets.Values.get(SheetID, rangeName).values;
    return rows;
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