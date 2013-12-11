function Bullet(from, to, scene, dt, map){
    var geometry = new THREE.Geometry();
    this.map = map;
    this.oldX = 0;
    this.oldY = 0;
    var deltaVec = new THREE.Vector3();
    deltaVec.x = to.x - from.x;
    deltaVec.y = 0;
    deltaVec.z = to.z - from.z;
    
    deltaVec.normalize();
    this.deltaVec = deltaVec;
    
    this.speed = 100;

    var newTo = new THREE.Vector3();
    newTo.x = deltaVec.x * this.speed * dt;
    newTo.y = deltaVec.y * this.speed * dt +3;
    newTo.z = deltaVec.z * this.speed * dt;
   
    geometry.vertices.push(new THREE.Vector3(0,3,0));
    geometry.vertices.push(newTo);
    
    
    var meterial = new THREE.LineBasicMaterial({
        color : 0xffff00
    });
    
    this.line = new THREE.Line(geometry, meterial);
    
    this.line.position = from.clone();
    
    scene.add(this.line);
    this.scene = scene;
}

Bullet.prototype.move = function(dt){
    
    // 벽 충돌 체크할 때 사용하려고 만든 변수들.
    // 일단 좀비와 총알먼저 만들기 위해 잠시 내버려둠.
    //var x = this.line.position.x;
    //var y = this.line.position.y;
    //var z = this.line.position.z;
    
    //var nx = parseInt((x + this.deltaVec.x * this.speed * dt) / 10);
    //var ny = parseInt((y + this.deltaVec.y * this.speed * dt) / 10);
    //var nz = parseInt((z + this.deltaVec.z * this.speed * dt) / 10);

    //움직이기
    this.oldX = this.line.position.x;
    this.oldY = this.line.position.z;
    //console.log("old xy = "+this.oldX + ", "+this.oldY);
    
    this.line.position.x += this.deltaVec.x * this.speed * dt;
    this.line.position.y += this.deltaVec.y * this.speed * dt;
    this.line.position.z += this.deltaVec.z * this.speed * dt;
    
    if(this.line.position.x < 0 || this.line.position.x > 510) {this.scene.remove(this.line); return false};
    if(this.line.position.z < 0 || this.line.position.z > 510) {this.scene.remove(this.line); return false};
    return true;
}

Bullet.prototype.hitZombie = function(zom, dt, idx) {
    // 총알이 이동해온 경로에 대한 직선의 공식 구함.
    // 분모가 되는 x의 뺄셈은 직선이 무조건 이동하므로 0이 될 수 없고, 맵을 벗어나면 소멸되도록 되어있으므로
    // 따로 처리하지 않는다.
    var decline = (this.line.position.z - this.oldY) / (this.line.position.x - this.oldX);
    
    // ax + by + c = 0의 형태를 만들기 위해 두 점을 지나는 직선의 공식 사용.
    a = decline;
    b = -1;
    c = this.oldY - decline*this.oldX;

    // 좀비의 현재 위치 P 에 대하여
    d = zom.curX;
    e = zom.curY;
    
    // 직선과 점의 거리 공식 사용.
    dist = Math.abs((a*d + b*e + c)/Math.sqrt(d*d + e*e));
    // 거리가 좀비 근처인 경우 좀비 사라짐. 또는 좀비 에너지 감소.
    if(parseInt(dist) < 3) {
        this.scene.remove(zom);
        console.log("dist = " + dist);
        return true;
    }
}