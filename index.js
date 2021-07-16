class Chamber {

    constructor(init) {
        if(init.length > 50) {
            throw new Error("Chamber string must be less than 50 characters");
        } else if(init.length < 1) {
            throw new Error("Chamber string is empty");
        }

        this.initialString = init;
        this.chamber_length = init.length;
        this.particles = this._particlesFromString(init);
    }

    animate(speed) {
        if(typeof speed !== 'number') {
            throw new Error("Animate speed must be an integer between 1 - 10");
        } else if(speed > 10) {
            throw new Error("Animate speed must be less than or equal to 10");
        } else if(speed < 1) {
            throw new Error("Animate speed must be positive non-zero integer");
        }

        let frames = [];

        let newFrame;
        do {
            newFrame = this._renderCurrentFrame();
            frames.push(newFrame.output);
            this._moveParticles(speed);
        } while (!newFrame.isEmpty);

        return frames;
    }

    _particlesFromString(state) {
        //convert init into object representation of R and L particles.
        const valid_characters = ['R','L','.'];
        const particles = state.split('').map((character, index) => {

            if(valid_characters.indexOf(character) === -1) {
                throw new Error(`Invalid character "${character}" in Chamber`);
            } 
           
            return {direction: character, current_position: index};
        })
        .filter(particle_object => {
            const { direction } = particle_object;
            return direction === 'R' || direction === 'L';
        });

        return particles;
    }

    _moveParticles(speed) {
        //Moves each particle in Chamber by given speed
        this.particles.forEach(particle => {
            const { direction } = particle;

            if(direction === 'R') {
                particle.current_position += speed; 
            } else if(direction === 'L') {
                particle.current_position -= speed;
            } else {
                throw new Error(`Unrecognized particle direction ${direction}`);
            }
        });
    }


    _renderCurrentFrame() {
        //returns an object with the following properties
        //output: The string representation of the current Chamber's state
        //isEmpty: true if the Chamber has no particles within it.
        
        let chamber_output = '.'.repeat(this.chamber_length).split('');

        let isEmpty = true;
        this.particles.forEach(particle => {
            const { current_position } = particle;
            if(current_position < this.chamber_length && 
               current_position >= 0) {
                chamber_output[current_position] = 'X';
                isEmpty = false;
            }
        });

        let rendered_chamber = chamber_output.join('');

        return {output: rendered_chamber, isEmpty};
    }
}

module.exports = Chamber;
