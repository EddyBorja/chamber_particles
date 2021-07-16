var Chamber = require('./index');


//for each test case:
//first element of each array is the init string
//second element is the speed
//third element is the expected result
let testCases = [
    ["..R....", 2,
    [
    "..X....",
    "....X..",
    "......X",
    "......."
    ]],

    ["RR..LRL", 3,
    [
    "XX..XXX",
    ".X.XX..",
    "X.....X",
    ".......",
    ]],

    ["LRLR.LRLR",2,
    [
    "XXXX.XXXX",
    "X..X.X..X",
    ".X.X.X.X.",
    ".X.....X.",
    "........."
    ]],

    ["RLRLRLRLRL",10,
    [
    "XXXXXXXXXX",
    ".........."
    ]],

    ["...",1,
    ["..."]],
]


describe("Chamber animation tests", () => {
    test.each(testCases)("Test chamber %p with speed %p makes correct result",
        (init, speed, expectedResult) => {
            const result = new Chamber(init).animate(speed);
            result.forEach((line, index) => {
                expect(line).toEqual(expectedResult[index]);
            });
        }
    );
});

describe("Chamber unit tests", () => {
    test('Init string converts to object model correctly', () => {
        let chamber = new Chamber('..R..L..');

        expect(chamber.particles.length).toBe(2);

        chamber.particles.forEach(particle => {
            expect(particle.direction).not.toBe('.');

            if(particle.direction === 'R') {
                expect(particle.current_position).toBe(2);
            }

            if(particle.direction === 'L') {
                expect(particle.current_position).toBe(5);
            }
        });
    });

    test('Particles advance correctly at given speed', () => {
        let chamber = new Chamber('..R..L..');
        chamber._moveParticles(2);

        chamber.particles.forEach(particle => {
            if(particle.direction === 'R') {
                expect(particle.current_position).toBe(4);
            }

            if(particle.direction === 'L') {
                expect(particle.current_position).toBe(3);
            }
        });
    });

    test('Chamber renders single frame correctly', () => {
        let chamber = new Chamber('..R..L..');
        let render = chamber._renderCurrentFrame();
        let expectedOutput = '..X..X..';
        expect(render.output).toEqual(expectedOutput);
    });

    test('Empty Chamber detected correctly', () => {
        let chamber = new Chamber('........');
        let render = chamber._renderCurrentFrame();
        expect(render.isEmpty).toBeTruthy();
    });
});

describe("Edge Cases", () => {
    test('Chamber string with invalid characters fails', () => {
        const badString = '.H.R..L...';
        expect(() => {
            new Chamber(badString).animate(1);
        }).toThrowError('Invalid character "H" in Chamber');
    });

    test('Chamber string longer than 50 characters fails', () => {
        const badString = '.'.repeat(51);
        expect(() => {
            new Chamber(badString).animate(1);
        }).toThrowError("Chamber string must be less than 50 characters");
    });

    test('Empty Chamber string fails', () => {
        const badString = '';
        expect(() => {
            new Chamber(badString).animate(1);
        }).toThrowError("Chamber string is empty");
    });

    test('Animate speed greater than 10 fails', () => {
        expect(() => {
            new Chamber(".R....").animate(11);
        }).toThrowError("Animate speed must be less than or equal to 10");
    });

    test('Animate speed of 0 fails', () => {
        expect(() => {
            new Chamber(".R....").animate(0);
        }).toThrowError("Animate speed must be positive non-zero integer");
    });

    test('Negative Animate speed fails', () => {
        expect(() => {
            new Chamber(".R....").animate(-1);
        }).toThrowError("Animate speed must be positive non-zero integer");
    });
});



