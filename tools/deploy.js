const fs = require('fs');
const path = require('path');
const archiver = require('archiver');


// 存在しない場合はフォルダを作成する
// 存在する場合はフォルダかどうか確認する。
let distPath = path.resolve(__dirname, '../dist');

// 存在しない場合はフォルダを作成する
if ( !fs.existsSync(distPath) ) {
    fs.mkdirSync(distPath);
    console.log(`created ${distPath}`);
}

// フォルダ内のファイルを全て削除する
// c.f.https://diwao.com/2019/09/node-delete-files.html
fs.readdir(distPath, (err, files) => {
    if(err){
      throw err;
    }
    files.forEach((file) => {
        fs.rm(`${distPath}/${file}`, { force: true, recursive: true }, ( err ) => {
            if(err){
            throw(err);
            }
            console.log(`deleted ${file}`);
        });
    });
  });

const zipFiles = () => {
  // 出力先のzipファイル名
  var zip_file_name = path.resolve(__dirname, '../dist/package.zip');;

  // ストリームを生成して、archiverと紐付ける
  var archive = archiver.create('zip', {});
  var output = fs.createWriteStream(zip_file_name);
  archive.pipe(output);

  // 圧縮対象のファイル及びフォルダ
  archive.glob('main.js');
  archive.glob('main.css');
  archive.glob('main.geojson');
  archive.glob('index.html');
  archive.glob('logo.png');
  archive.glob('css/**/*');
  archive.glob('js/**/*');

  // zip圧縮実行
  archive.finalize();
  output.on("close", function () {
      // zip圧縮完了すると発火する
      var archive_size = archive.pointer();
      console.log(`complete! total size : ${archive_size} bytes`);
  });
}

zipFiles();
