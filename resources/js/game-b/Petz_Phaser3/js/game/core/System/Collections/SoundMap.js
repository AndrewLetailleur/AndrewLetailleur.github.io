export class SoundMap extends DynamicMap
  {
    //Get is a method within the Dynamic map, and if not that one, it'll be in the map within that one
    //It pretty much just gives you the object you're looking for
    playSound(key)
    {
    let sound = get(key);    
    //...phaser code to play stuff etc
    sound.play();
    }
    playMusic(key)//hacked guess - ail
    {
        let music = get(key);    
        //...phaser code to play stuff etc
        music.play({loop: true});   
    } 
    stopMusic(key)//hacked guess #2 - ail
    {
        let music = get(key);    
        //...phaser code to play stuff etc
        music.stop();   
    }  
}