import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            counters: Array(90).fill().map((e, i) => i + 1),
            playedCounters: [],
        };
    }

    handleClick() {
        // TODO: Endgame state
        // TODO: Reset button
        const num = Math.floor(Math.random() * this.state.counters.length);
        const value = this.state.counters[num];
        const counters = this.state.counters.slice();
        counters.splice(num, 1);
        const playedCounters = this.state.playedCounters.concat(value);
        this.setState({
            counters: counters,
            playedCounters: playedCounters,
        });
    }

    render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Counters count={this.state.counters.length} />
        <DrawButton onClick={() => this.handleClick()} />
        <PlayedCounters playedCounters={this.state.playedCounters} />
        <div>Tickets in play/players</div>
      </div>
    );
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

class DrawButton extends Component {
    render() {
        return <button onClick={this.props.onClick}>Draw</button>;
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

export default App;
