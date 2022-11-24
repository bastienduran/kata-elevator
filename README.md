# Elevator Kata - Event Oriented

by Meidi Airouche

## Installation of required services for the Kata

### Install Kafka & Zookeeper

<code>docker-compose up -d</code>

### Check for Kafka service

Check if Kafka service is running on port 29092
<code>nc -z localhost 29092</code>

It should return
<code>Connection to localhost port 29092 [tcp/*] succeeded!</code>

You can also check that Kafka logged a start
<code>docker-compose logs kafka | grep -i started</code>

### Check for Zookeeper service

Check if Zookeeper service is running on port 22181
<code>nc -z localhost 22181</code>

It should return
<code>Connection to localhost port 22181 [tcp/*] succeeded!</code>

## Exercice

Convoy the more people you can calling for the elevator in a given timeframe (5min for example). The constraints are the following :

- People are calling for the elevator every 5 to 10 secs
- The elevator takes 1 sec to go from one floor to another
- The elevator takes a pause of 1 sec when people enter
- The elevator takes a pause of 1 sec when people out
