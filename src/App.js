import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    getInitialState() {
        return {
            counters: new CountersLogic(),
            playedCounters: [],
            players: [],
            isStarted: false,
            isFinished: false,
            playerName: "",
        }
    }

    constructor() {
        super();
        this.state = this.getInitialState();
    }

    changeName(name) {
        this.setState({ playerName: name });
    }

    addPlayer() {
        const player = new Player(this.state.playerName);
        const players = this.state.players.concat(player);
        this.setState({
            players: players,
            playerName: "",
        });
    }

    reset() {
        this.setState(this.getInitialState());
    }

    start() {
        this.setState({ isStarted: true });
    }

    drawCounter() {
        if (!this.state.isStarted || this.state.isFinished) {
            return;
        }
        const counters = this.state.counters.getCrankedCounters();
        const playedCounters = this.state.playedCounters.concat(counters.getCurrentValue());
        this.setState({
            counters: counters,
            playedCounters: playedCounters,
            isFinished: counters.getLength() === 0,
        });
    }

    render() {
        return (
            <div className="App">
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Welcome to React</h2>
            </div>
            <Counters count={this.state.counters.getLength()} />
            <Buttons
                    onDraw={() => this.drawCounter()}
                    onReset={() => this.reset()}
                    onStart={() => this.start()}
                    onChange={e => {
                        this.changeName(e.target.value);
                    }}
                    onSubmit={e => {
                        e.preventDefault();
                        this.addPlayer();
                    }}
                    name={this.state.playerName}
                    isStarted={this.state.isStarted}
                    isFinished={this.state.isFinished} />
            <PlayedCounters playedCounters={this.state.playedCounters} />
            <Players players={this.state.players}/>
            </div>
        );
    }
}

class RandomizerWithoutRepeats {
    constructor(length) {
        this.values = Array(length).fill().map((e, i) => i + 1);
    }

    getNextRandomValue() {
        const num = Math.floor(Math.random() * this.values.length);
        const value = this.values[num];
        this.values.splice(num, 1);
        return value;
    }
}

class CountersLogic {
    constructor(counters, current) {
        if (counters === undefined) {
            let arrayLength = 90;
            let randomizer = new RandomizerWithoutRepeats(arrayLength);
            this.counters = Array(arrayLength).fill().map(() => randomizer.getNextRandomValue());
            this.currentValue = NaN;
        } else {
            this.counters = counters;
            this.currentValue = current;
        }
    }

    getCrankedCounters() {
        const value = this.counters[0];
        const counters = this.counters.slice(1);
        return new CountersLogic(counters, value);
    }

    getLength() {
        return this.counters.length;
    }

    getCurrentValue() {
        return this.currentValue;
    }
}

class Player {
    constructor(name) {
        this.tickets = Array(3);
        this.name = name;
    }

    getName() {
        return this.name;
    }
}

class Ticket {
    constructor() {
        this.rows = Array(3);
    }
}

class Row {
    constructor() {
        this.columns = Array(9);
    }
}

class Counters extends Component {
    render() {
        const counterImages = [];
        for (let i = 0; i < this.props.count; i++) {
            counterImages.push(<b>O</b>);
        }
        return <p>{counterImages}</p>;
    }
}

class Buttons extends Component {
    render() {
        return (
            <p className="buttons-component">
                <form onSubmit={this.props.onSubmit}>
                    <span>Name: </span>
                    <input onChange={this.props.onChange} value={this.props.name}/>
                    <button disabled={this.props.isStarted}>Add player</button>
                </form>
                <button disabled={this.props.isStarted} onClick={this.props.onStart}>Start</button>
                <button disabled={!this.props.isStarted || this.props.isFinished} onClick={this.props.onDraw}>Draw</button>
                <button onClick={this.props.onReset}>Reset</button>
            </p>
        );
    }
}

class PlayedCounters extends Component {
    render() {
        const counterImages = [];
        let playedCounters = this.props.playedCounters;
        for (let i = 0; i < playedCounters.length; i++) {
            let element = i === 0
                ? <b>{playedCounters[i]}</b>
                : <b>, {playedCounters[i]}</b>;
            counterImages.push(element);
        }
        return <p>{counterImages}</p>;
    }
}

class Players extends Component {
    render() {
        const playerImages = [];
        let players = this.props.players;
        for (let i = 0; i < players.length; i++) {
            let element = i === 0
                ? <b>{players[i].name}</b>
                : <b>, {players[i].name}</b>;
            playerImages.push(element);
        }
        return <p>{playerImages}</p>;
    }
}

export default App;
