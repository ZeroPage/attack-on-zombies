function Bullet(from, to, scene, dt){
    var geometry = new THREE.Geometry();
    
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
   
    geometry.vertices.push(new THREE.Vector3(0,0,0));
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
    //움직이기
    this.line.position.x += this.deltaVec.x * this.speed * dt;
    this.line.position.y += this.deltaVec.y * this.speed * dt;
    this.line.position.z += this.deltaVec.z * this.speed * dt;
    
    if(this.line.position.x < 0 || this.line.position.x > 510) {this.scene.remove(this.line); return false};
    if(this.line.position.z < 0 || this.line.position.z > 510) {this.scene.remove(this.line); return false};
}