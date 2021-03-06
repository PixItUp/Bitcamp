// @flow
var $ = require('jquery');
const sketch = require('../lib/sketch.js');
sketch.sketch($);

import type {DrawUpdate} from '../update';
import type {Container} from './htmlUtils';

export function setupDraw(update: DrawUpdate, socket: any){
  const canvas = $('#drawing')[0];
  const button = $("#submit-drawing");
  const submitted = $("#draw-submitted");

  button.show();
  submitted.hide();

  $(window).resize(resizeCanvas);//not 100% sure this will work

  function resizeCanvas(){
    const width = Math.min($("#drawDiv").width(), 750);
    const height = Math.min($("#drawDiv").height(), 1400);
    $(canvas).attr('width',  width * 0.9);
    $(canvas).attr('height', Math.max(height * 0.7 - 100, 400));
  }
  resizeCanvas();

  canvas.width = canvas.width;//Clears canvas

  $('#drawing').sketch();
  $('#drawing').sketch().actions = [];//Removed sketch's memory of the previous drawing
  var iveGoneYet = false;
  function submitDrawing() {
    if (!iveGoneYet){
      console.log($('#drawing')[0].toDataURL());
      socket.emit("event", JSON.stringify({
        data: {
          type: "Draw",
          drawing: {
            dataURI: $('#drawing')[0].toDataURL()
          }
        }
      }))
      submitted.show();
      button.hide();
      iveGoneYet = true;
    } else {
      console.log('duplicate call of draw submit');
    }
  }
  button.click(submitDrawing);

  $("#draw-prompt").text('"' + update.description + '"');
}
