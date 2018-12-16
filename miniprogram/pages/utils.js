const MIN_DIFF = 50; // 50 px for x/y diff
const getSlideDirection = (startTouch, endTouch) => {
  if (!startTouch || !endTouch) {
    console.log("INVALID START END TOUCH", startTouch, endTouch);
    return null;
  }
  let startX = startTouch.pageX;
  let startY = startTouch.pageY;
  let endX = endTouch.pageX;
  let endY = endTouch.pageY;

  let diffX = Math.abs(startX - endX);
  let diffY = Math.abs(startY - endY);

  if (diffX <= MIN_DIFF && diffY <= MIN_DIFF) {
    return null;// ignore slide
  }
  if (diffX <= MIN_DIFF || (diffX > MIN_DIFF && diffY > MIN_DIFF && diffX <= diffY)) {
    // UP or DOWN
    return startY > endY ? 'UP' : 'DOWN'
  }
  if (diffY <= MIN_DIFF || (diffX > MIN_DIFF && diffY > MIN_DIFF && diffY <= diffX)) {
    return startX > endX ? 'LEFT' : 'RIGHT'
  }
  return null;
}

const utils = {
  // 往右滑
  /**
   * @params: 
   *    startTouch, endTouch 至少要有 pageX 和 pageY
   * @return 
   *    UP/DOWN/LEFT/RIGHT
   *    或者 null 当X/Y 没动都小于MIN_DIFF
   */
  getSlideDirection: (startTouch, endTouch) => {
    let action = getSlideDirection(startTouch, endTouch);
    console.log('[detected action]' + action);
    return action;
  }
}

module.exports = utils;