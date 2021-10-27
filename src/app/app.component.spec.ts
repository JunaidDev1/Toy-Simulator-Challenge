import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Constants } from './constants';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('placeAtOrigin()', () => {
    it('should place the robot at origin if valid coordinates have been entered', () => {
      component.coordinates.positionX = 0;
      component.coordinates.positionY = 0;
      component.currentDirection = Constants.EAST;
      const expectedOutput = `${Constants.PLACE} 0, 0, ${Constants.EAST}`;
      component.placeAtOrigin();
      expect(component.isRobotPlacedAtOrigin).toBe(true);
      expect(component.inputCommands.indexOf(expectedOutput)).toBeGreaterThan(-1);
    });

    it('should not place the robot at origin if any of the coordinates is invalid', () => {
      component.coordinates.positionX = 1;
      component.coordinates.positionX = -4;
      component.currentDirection = Constants.EAST;
      component.placeAtOrigin();
      expect(component.isRobotPlacedAtOrigin).toBe(false);
    });

    it('should not place the robot at origin if facing direction is not being selected', () => {
      component.coordinates.positionX = 1;
      component.coordinates.positionY = 2;
      component.placeAtOrigin();
      expect(component.isRobotPlacedAtOrigin).toBe(false);
    });
  });

  describe('changeDirection()', () => {
    it('should change the current direction towards WEST, if currently facing NORTH and asked to move LEFT', () => {
      component.currentDirection = Constants.NORTH;
      component.isRobotPlacedAtOrigin = true;
      component.changeDirection(Constants.LEFT);
      expect(component.currentDirection).toEqual(Constants.WEST);
    });

    it('should change the current direction towards SOUTH, if currently facing EAST and asked to move RIGHT', () => {
      component.currentDirection = Constants.EAST;
      component.isRobotPlacedAtOrigin = true;
      component.changeDirection(Constants.RIGHT);
      expect(component.currentDirection).toEqual(Constants.SOUTH);
    });
  });

  describe('outputReport()', () => {
    it('should output results if the robot is placed at some origin successfully', () => {
      component.isRobotPlacedAtOrigin = true;
      component.coordinates = {
        positionX: 1,
        positionY: 2
      };
      component.currentDirection = Constants.NORTH;
      const expectedResult = `1, 2, ${Constants.NORTH}`;
      component.outputReport();
      expect(component.outputResult).toEqual(expectedResult);
    });
  });

  describe('validateMaxPosition()', () => {
    it('should move the robot to next facing origin if its a valid move', () => {
      component.inputCommands = [];
      component.validateMaxPosition(4, Constants.COORDINATE_X);
      expect(component.inputCommands).toEqual([Constants.MOVE]);
    });

    it('should not move the robot next if the move can make the robot fall off', () => {
      component.inputCommands = [];
      component.validateMaxPosition(5, Constants.COORDINATE_Y);
      expect(component.inputCommands).toEqual([]);
    });
  });

  describe('validateMinPosition()', () => {
    it('should move the robot to next facing origin if its a valid move', () => {
      component.inputCommands = [];
      component.validateMinPosition(0, Constants.COORDINATE_X);
      expect(component.inputCommands).toEqual([Constants.MOVE]);
    });

    it('should not move the robot next if the move can make the robot fall off', () => {
      component.inputCommands = [];
      component.validateMinPosition(-1, Constants.COORDINATE_Y);
      expect(component.inputCommands).toEqual([]);
    });
  });

  describe('moveTowardsFacing()', () => {
    it('should call validateMaxPosition if current direction is EAST/NORTH', () => {
      const validateSpy = spyOn(component, 'validateMaxPosition');
      component.currentDirection = Constants.EAST;
      component.isRobotPlacedAtOrigin = true;
      component.moveTowardsFacing();
      expect(validateSpy).toHaveBeenCalled();
    });

    it('should call validateMinPosition if current direction is WEST/SOUTH', () => {
      const validateSpy = spyOn(component, 'validateMinPosition');
      component.currentDirection = Constants.SOUTH;
      component.isRobotPlacedAtOrigin = true;
      component.moveTowardsFacing();
      expect(validateSpy).toHaveBeenCalled();
    });
  });

  describe('getNewDirection()', () => {
    it('should return WEST if there is no current direction and asked to move LEFT', () => {
      component.currentDirection = '';
      const newDirection = component.getNewDirection(Constants.LEFT);
      expect(newDirection).toEqual(Constants.WEST);
    });

    it('should return EAST if current direction is NORTH and asked to move RIGHT', () => {
      component.currentDirection = Constants.NORTH;
      const newDirection = component.getNewDirection(Constants.RIGHT);
      expect(newDirection).toEqual(Constants.EAST);
    });
  });

  describe('isValidCoordinate()', () => {
    it('should return TRUE if coordinates are valid and current direction is set', () => {
      component.coordinates = {
        positionX: 1,
        positionY: 2
      };
      component.currentDirection = Constants.NORTH;
      expect(component.isValidCoordinate()).toBe(true);
    });

    it('should return FALSE if any of the coordinates is invalid and current direction is set', () => {
      component.coordinates = {
        positionX: -3,
        positionY: 0
      };
      component.currentDirection = Constants.NORTH;
      expect(component.isValidCoordinate()).toBe(false);
    });

    it('should return FALSE if coordinates are valid and current direction is not set', () => {
      component.coordinates = {
        positionX: 2,
        positionY: 4
      };
      component.currentDirection = '';
      expect(component.isValidCoordinate()).toBe(false);
    });
  });

  describe('clearData()', () => {
    it('should reset the app to initial state', () => {
      component.coordinates = {
        positionX: 1,
        positionY: 2
      };
      component.isRobotPlacedAtOrigin = true;
      component.outputResult = '1, 1, NORTH';
      component.inputCommands = [Constants.MOVE];
      component.currentDirection = Constants.NORTH;
      component.clearData();
      expect(component.isRobotPlacedAtOrigin).toBe(false);
      expect(component.inputCommands).toEqual([]);
      expect(component.coordinates.positionX).toBeNull;
      expect(component.coordinates.positionY).toBeNull;
      expect(component.outputResult).toEqual('');
      expect(component.currentDirection).toEqual('');
    });
  });

});
