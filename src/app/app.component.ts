import { Component } from '@angular/core';
import { Constants } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  currentDirection = '';
  allDirections: string[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

  coordinates = {
    positionX: null,
    positionY: null
  };

  outputResult: string;
  inputCommands: string[] = [];
  isRobotPlacedAtOrigin = false;

  constructor() {
  }

  /**
 * To place the robot at certain origin with some direction based on input coordinates values
 */
  placeAtOrigin(): void {
    if (this.isValidCoordinate()) {
      this.isRobotPlacedAtOrigin = true;
      const placeCommand = `${Constants.PLACE} ${this.coordinates.positionX}, ${this.coordinates.positionY}, ${this.currentDirection}`;
      this.inputCommands.push(placeCommand);
    } else {
      alert(Constants.INVALID_COORDINATES_ERROR);
    }
  }

  /**
 * To change the current direction based on the given command (LEFT/RIGHT)
 * @param {string} command - The command that is being selected by user
 */
  changeDirection(command: string): void {
    if (this.isRobotPlacedAtOrigin) {
      this.currentDirection = this.getNewDirection(command);
    } else {
      alert(Constants.MISSING_COORDINATES_ERROR);
    }
  }

  /**
 * To display output results after placing/moving the robot at certain origin
 */
  outputReport(): void {
    if (this.isRobotPlacedAtOrigin) {
      this.outputResult = `${this.coordinates.positionX}, ${this.coordinates.positionY}, ${this.currentDirection}`;
    } else {
      alert(Constants.MISSING_COORDINATES_ERROR);
    }
  }

  /**
 * To validate next origin when user directs the robot to move forward towards (EAST/NORTH)
 * @param {number} nextPosition - The next origin to which robot is directed to move
 * @param {string} coordinateKey - The coordinate axis to be updated (positionX/positionY)
 */
  validateMaxPosition(nextPosition: number, coordinateKey: string): void {
    if (nextPosition < 5) {
      this.coordinates[coordinateKey]++;
      this.inputCommands.push(Constants.MOVE);
    } else {
      alert(Constants.ROBOT_FALL_OFF_ERROR);
    }
  }

  /**
 * To validate next origin when user directs the robot to move forward towards (WEST/SOUTH)
 * @param {number} nextPosition - The next origin to which robot is directed to move
 * @param {string} coordinateKey - The coordinate axis to be updated (positionX/positionY)
 */
  validateMinPosition(prevPosition: number, coordinateKey: string): void {
    if (prevPosition >= 0) {
      this.coordinates[coordinateKey]--;
      this.inputCommands.push(Constants.MOVE);
    } else {
      alert(Constants.ROBOT_FALL_OFF_ERROR);
    }
  }

  /**
* To move the robot next origin when user directs the robot to move forward
*/
  moveTowardsFacing(): void {
    if (this.isRobotPlacedAtOrigin) {
      switch (this.currentDirection) {
        case Constants.EAST: {
          this.validateMaxPosition(this.coordinates.positionX + 1, Constants.COORDINATE_X);
          break;
        }
        case Constants.WEST: {
          this.validateMinPosition(this.coordinates.positionX - 1, Constants.COORDINATE_X);
          break;
        }
        case Constants.NORTH: {
          this.validateMaxPosition(this.coordinates.positionY + 1, Constants.COORDINATE_Y);
          break;
        }
        case Constants.SOUTH: {
          this.validateMinPosition(this.coordinates.positionY - 1, Constants.COORDINATE_Y);
          break;
        }
      }
    } else {
      alert(Constants.MISSING_COORDINATES_ERROR);
    }
  }

  /**
 * To get the new direction based on the given command
 * @param {string} command - The command that is being keyed in by user
 */
  getNewDirection(command: string): string {
    this.inputCommands.push(command);
    let currentDirectionIndex = this.allDirections.indexOf(this.currentDirection);

    switch (command) {
      case Constants.LEFT:
        currentDirectionIndex--;
        break;
      case Constants.RIGHT:
        currentDirectionIndex++;
        break;
    }

    if (currentDirectionIndex < 0) { return Constants.WEST; }
    if (currentDirectionIndex > 3) { return Constants.NORTH; }
    return this.allDirections[currentDirectionIndex];
  }

  /**
  * To validate if user has entered coordinates value (0 to 4) and have choosen a facing direction
  */
  isValidCoordinate(): boolean {
    return this.coordinates.positionX >= 0 && this.coordinates.positionX < 5 &&
      this.coordinates.positionY >= 0 && this.coordinates.positionY < 5 && this.currentDirection !== '';
  }

  /**
 * To reset the input values and output results (Resetting app to initial state!)
 */
  clearData(): void {
    this.inputCommands = [];
    this.coordinates.positionX = null;
    this.coordinates.positionY = null;
    this.currentDirection = '';
    this.outputResult = '';
    this.isRobotPlacedAtOrigin = false;
  }

}
