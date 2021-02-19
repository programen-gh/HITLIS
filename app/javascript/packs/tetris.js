document.addEventListener("DOMContentLoaded", function(){

  //落ちるスピード
  const GAME_SPEED = 500;
  //行列サイズ
  const FIELD_COL = 10;
  const FIELD_ROW = 20;
  //ブロック一つのサイズ（ピクセル）
  const BLOCK_SIZE = 30;
  //スクリーンサイズ
  const SCREEN_W = BLOCK_SIZE * FIELD_COL;
  const SCREEN_H = BLOCK_SIZE * FIELD_ROW;
  //テトロミノのサイズ
  const TETRO_SIZE = 4;
  //開始位置の座標
  const START_X = FIELD_COL/2 -TETRO_SIZE/2;
  const START_Y = 0;
  //テトロミノの色
  const TETRO_COLORS = [
    "#FFF", //0.空
    "#000", //1.black
    "#F00", //2.red
    "#0F0", //3.lime
    "#00F", //4.blue
    "#0FF", //5.aqua
    "#F0F", //6.fuchsia
    "#FF0", //7.yellow
  ];
  //テトロミノの種類
  const TETRO_TYPES = [
    [],//0.空
    [  //1.I
      [ 0, 0, 0, 0 ],
      [ 1, 1, 1, 1 ],
      [ 0, 0, 0, 0 ],
      [ 0, 0, 0, 0 ]
    ],
    [  //2.L
      [ 0, 1, 0, 0 ],
      [ 0, 1, 0, 0 ],
      [ 0, 1, 1, 0 ],
      [ 0, 0, 0, 0 ]
    ],
    [  //3.J
      [ 0, 0, 1, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 1, 1, 0 ],
      [ 0, 0, 0, 0 ]
    ],
    [  //4.T
      [ 0, 1, 0, 0 ],
      [ 0, 1, 1, 0 ],
      [ 0, 1, 0, 0 ],
      [ 0, 0, 0, 0 ]
    ],
    [  //5.O
      [ 0, 0, 0, 0 ],
      [ 0, 1, 1, 0 ],
      [ 0, 1, 1, 0 ],
      [ 0, 0, 0, 0 ]
    ],
    [  //6.Z
      [ 0, 0, 0, 0 ],
      [ 1, 1, 0, 0 ],
      [ 0, 1, 1, 0 ],
      [ 0, 0, 0, 0 ]
    ],
    [  //7.S
      [ 0, 0, 0, 0 ],
      [ 0, 1, 1, 0 ],
      [ 1, 1, 0, 0 ],
      [ 0, 0, 0, 0 ]
    ],

  ];

  //テトロミノの形
  let tetroT = Math.floor( Math.random() * (TETRO_TYPES.length-1)) + 1;
  //テトロミノ本体
  let tetro = TETRO_TYPES[ tetroT ];
  //テトロミノの座標
  let tetroX = START_X;
  let tetroY = START_Y;
  //フィールドの中身
  let field = [];
  //ゲームオーバーフラグ
  let over = false;
  //キャンバスの設定
  let can = document.getElementById("can");
  let con = can.getContext("2d");
  
  can.width = SCREEN_W;
  can.height = SCREEN_H;
  can.style.border = "4px solid #555";

  init();
  drawAll();
  setInterval( dropTetro, GAME_SPEED);

  //初期化
  function init()
  {
    for(let y=0; y<FIELD_ROW; y++){
      field[y] = [];
      for(let x=0; x<FIELD_COL; x++){
        field[y][x] = 0;
      }
    }
  }

  //ブロック一つを描画する
  function drawBlock(x,y,c)
  {
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;

    con.fillStyle=TETRO_COLORS[c];
    con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    con.strokeStyle="black";
    con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
  }
  
  //全部描画する
  function drawAll()
  {
    con.clearRect(0, 0, SCREEN_W, SCREEN_H);

    for(let y=0; y<FIELD_ROW; y++){
      for(let x=0; x<FIELD_COL; x++){
        if( field[y][x] ){
          drawBlock(x,y, field[y][x]);
        }
      }
    }

    for(let y=0; y<TETRO_SIZE; y++){
      for(let x=0; x<TETRO_SIZE; x++){
        if( tetro[y][x] ){
          drawBlock(tetroX+x, tetroY+y, tetroT);
        }
      }
    }
  }
  
  //ブロックの衝突判定
  function checkMove(mx, my, ntetro)
  {
    if(ntetro == undefined) ntetro = tetro;

    for(let y=0; y<TETRO_SIZE; y++){
      for(let x=0; x<TETRO_SIZE; x++){
        if( ntetro[y][x] ){
          let nx = tetroX + mx + x;
          let ny = tetroY + my + y;
          if( ny < 0 || nx < 0 || ny >= FIELD_ROW || nx >= FIELD_COL || field[ny][nx] ){
            return false;
          } 
        }
      }
    }
    return true;
  }

  //テトロの回転
  function rotate()
  {
    let ntetro = [];

    for(let y=0; y<TETRO_SIZE; y++){
      ntetro[y] = [];
      for(let x=0; x<TETRO_SIZE; x++){
        ntetro[y][x] = tetro[TETRO_SIZE-x-1][y];
      }
    }
    return ntetro;
  }

  //ブロックを固定する処理
  function fixTetro()
  {
    for(let y=0; y<TETRO_SIZE; y++){
      for(let x=0; x<TETRO_SIZE; x++){
        if( tetro[y][x] ){
          field[tetroY + y][tetroX + x] = tetroT;
        }
      }
    }
  }

  //ラインが揃ったかチェックして消す
  function checkLine()
  {
    for(let y=0; y<FIELD_ROW; y++){
      let flag = true;
      for(let x=0; x<FIELD_COL; x++){
        if( !field[y][x] ){
          flag = false;
          break;
        }
      }

      if(flag){
        for(let ny = y; ny>0; ny--){
          for(let nx=0; nx<FIELD_COL; nx++){
            field[ny][nx] = field[ny-1][nx];
          }
        }
      }
    }
  }

  //ブロックの落ちる処理
  function dropTetro()
  {
    if(over) return;
    if( checkMove(0, 1) )tetroY++;
    else{
      fixTetro();
      checkLine();

      tetroT = Math.floor( Math.random() * (TETRO_TYPES.length-1)) + 1;
      tetro = TETRO_TYPES[ tetroT ]
      tetroX = START_X;
      tetroY = START_Y;

      if( !checkMove(0,0) ){
        over = true;
      }
    }
    drawAll();
  }

  //キーボードが押されたときの処理
  document.onkeydown = function(e){
    if(over) return;

    switch(e.key){
      case "a"://左
        if( checkMove(-1, 0) )tetroX--;
        break;
      case "w"://上
        if( checkMove(0, -1) )tetroY--;
        break;
      case "d"://右
        if( checkMove(1, 0) )tetroX++;
        break;
      case "s"://下
        if( checkMove(0, 1) )tetroY++;
        break;
      case "r"://回転
        let ntetro = rotate();
        if( checkMove(0, 0, ntetro) ) tetro = ntetro;
        break;
    }
    drawAll();
  }
});
