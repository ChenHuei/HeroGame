class BaseCharacter {

  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }

  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }

  getHurt(damage) {
    this.hp -= damage;
    if (this.hp < 1) {
      this.die();
    }

    let _this = this;
    let i = 1;

    _this.id = setInterval(function() {
      _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i +'.png';

      _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
      _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;

      
      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    }, 50);
  }

  die() {
    this.alive = false;
  }

  updateHtml(hpElement, hurtElement) {
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp / this.maxHp * 100 ) + "%";
  }

}

class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("召喚英雄 " + this.name + "！");
  }
  attack(character) {
    let damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  heal() {
    let recover = Math.floor(Math.random() * (this.ap / 1.5) + (this.ap / 2));
    this.hp += recover;
    this.hp > this.maxHp ? this.hp = this.maxHp : this.hp;
    super.updateHtml(this.hpElement, this.hurtElement);

    let _this = this;
    let i = 1;

    _this.id = setInterval(function() {
      _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/heal/'+ i +'.png';

      _this.element.getElementsByClassName("heal-text")[0].classList.add("recovered");
      _this.element.getElementsByClassName("heal-text")[0].textContent = recover;

      
      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("recovered");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    }, 50);    
  }

  getHurt(damage) {
    super.getHurt(damage);
    super.updateHtml(this.hpElement, this.hurtElement);
  }
}

class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("遇到怪獸 " + this.name + "！");
  }
  attack(character) {
    let damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }
  getHurt(damage) {
    super.getHurt(damage);
    super.updateHtml(this.hpElement, this.hurtElement);
  }
}

let hero = new Hero("Alex", 130, 30);
let monster = new Monster("Shan", 130, 20);
let rounds = 10;

function endTurn() {
    rounds--;
    document.getElementById("round-num").textContent = rounds ;
    if (rounds < 1) {
      finish();
    }
  }

  function heroHeal() {

    document.getElementsByClassName("skill-block")[0].style.display = "none";

    setTimeout(function() {
      hero.heal();
    }, 200);

    setTimeout(function() {
      monster.element.classList.add("attacking");
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 550);
    }, 400);
  }

// Hero 點擊技能時觸發
function heroAttack() {
  // 隱藏技能按鈕
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function() {
    hero.element.classList.add("attacking");
    setTimeout(function() {
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500);
  }, 100);

  setTimeout(function() {
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          finish();
        } else {
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);
    } else {
      finish();
    }
  }, 1100);
}

document.onkeyup = function(event) {
  let key = String.fromCharCode(event.keyCode);

  if (key == "A" && document.getElementsByClassName("skill-block")[0].style.display != "none") {
    heroAttack();
  } else if (key == "D" && document.getElementsByClassName("skill-block")[0].style.display != "none") {
    heroHeal();
  }
}

function addSkillEvent() {
    let skill = document.getElementById("skill");
    skill.onclick = function() {
      heroAttack();
    }
    let heal = document.getElementById("heal");
    heal.onclick = function() {
      heroHeal();
    }
  }
  addSkillEvent();

  function finish() {
  let dialog = document.getElementById("dialog");
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}