import { Sketch, SketchProps } from "@p5-wrapper/react";



interface Ball {
    x: number;
    y: number;
    velocityX?: number;
    velocityY?: number;
    speed?: number;
}

interface GameProps extends SketchProps {
    leftPlayerY: number;
    rightPlayerY: number;
    ball: Ball;
}

const GameField: Sketch<GameProps> = (p5: any) => {
    let leftPlayerY: number;
    let rightPlayerY: number;

    let ball: Ball = { x: 500, y: 300 };

    let width = 1000;
    let height = 600;

    let scale = 1;

    const getWidth = () => {
        if (p5.windowWidth <= 600) {
            scale = 0.4;
        } else if (p5.windowWidth <= 800) {
            scale = 0.5;
        } else if (p5.windowWidth <= 1000) {
            scale = 0.6;
        } else if (p5.windowWidth <= 1400) {
            scale = 0.8;
        } else {
            scale = 1;
        }
    };

    p5.setup = () => {
        getWidth();
        p5.createCanvas(width * scale, height * scale);
    };

    p5.updateWithProps = (props: GameProps) => {
        leftPlayerY = props.leftPlayerY;
        rightPlayerY = props.rightPlayerY;
        ball = props.ball;
    };

    p5.windowResized = () => {
        getWidth();
        p5.resizeCanvas(width * scale, height * scale);
    };

    p5.draw = () => {
        p5.clear();
        p5.stroke(255);
        p5.strokeWeight(2);
        p5.ellipse((width * scale) / 2, (height * scale) / 2, 15 * scale);
        p5.line((width * scale) / 2, 0, (width * scale) / 2, height * scale);

        p5.rect(4 * scale, leftPlayerY * scale, 8 * scale, 80 * scale, 50);
        p5.rect(988 * scale, rightPlayerY * scale, 8 * scale, 80 * scale, 50);

        p5.ellipse(ball.x * scale, ball.y * scale, 15 * scale);
    };

    return {
        cleanup: p5.remove,
    };
};

export default GameField;
