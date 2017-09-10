import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    getArrayLength() {
        return 90;
    }

    getInitialState() {
        return {
            counters: new CountersLogic(undefined, undefined, this.getArrayLength()),
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
        const player = new Player(this.state.playerName, this.getArrayLength());
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
    constructor(counters, current, arrayLength) {
        if (counters === undefined) {
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

class ArraySplitter {
    constructor(values) {
        this.values = values;
    }

    getSplit(base, index) {
        const arr = [];
        for (let i = index; i < this.values.length; i = i + base) {
            arr.push(this.values[i]);
        }
        return arr;
    }
}

class Player {
    constructor(name, arrayLength) {
        let ticketCount = 3;
        this.name = name;
        const generator = new RandomizerWithoutRepeats(arrayLength);
        const splitter = new ArraySplitter(Array(45).fill().map(() => generator.getNextRandomValue()).sort((a, b) => a - b));
        this.tickets = Array(ticketCount).fill().map((e, i) => new Ticket(splitter.getSplit(ticketCount, i)));
    }
}

class Ticket {
    constructor(values) {
        let rowCount = 3;
        const splitter = new ArraySplitter(values);
        this.rows = Array(rowCount).fill().map((e, i) => new Row(splitter.getSplit(rowCount, i)));
    }
}

class Row {
    constructor(values) {
        this.columns = Array(5).fill().map((e, i) => values[i]);
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
            playerImages.push(<PlayerVisual player={players[i]} />);
        }
        return <div>{playerImages}</div>;
    }
}

class PlayerVisual extends Component {
    render() {
        const result = [];
        const player = this.props.player;
        result.push(<div>{player.name}</div>);
        for (let i = 0; i < player.tickets.length; i++) {
            result.push(<TicketVisual ticket={player.tickets[i]} />);
        }
        return <div className="player">{result}</div>;
    }    
}

class TicketVisual extends Component {
    render() {
        const result = [];
        const ticket = this.props.ticket;
        for (let i = 0; i < ticket.rows.length; i++) {
            result.push(<RowVisual row={ticket.rows[i]} />);
        }
        return <div className="ticket">{result}</div>;
    }
}

class RowVisual extends Component {
    render() {
        const result = [];
        const row = this.props.row;
        for (let i = 0; i < row.columns.length; i++) {
            result.push(<ColumnVisual column={row.columns[i]} />);
        }
        return <div className="ticket-row">{result}</div>;
    }
}

class ColumnVisual extends Component {
    render() {
        return <div className="ticket-column">{this.props.column}</div>;
    }
}


export default App;
