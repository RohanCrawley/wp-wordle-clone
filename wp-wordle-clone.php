<?php
/**
 * Plugin Name: WP Wordle Clone
 * Description: A simple Wordle clone embedded via shortcode.
 * Version: 1.0
 * Author: Rohan Crawley
 */

 // Display errors and warnings
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$answer_words_table = 'wp_answer_words';
$guess_words_table = 'wp_guess_words';

function get_random_answer_word(){
    global $answer_words_table;
    global $wpdb;
    $query = "SELECT word FROM $answer_words_table ORDER BY RAND() LIMIT 1";
    $random_word = $wpdb->get_var($query);
    return $random_word;
}

function get_guess_words() {
    global $wpdb;
    global $answer_words_table;
    global $guess_words_table;

    $guess_words_results = $wpdb->get_results("SELECT word FROM $guess_words_table", ARRAY_N);
    $answer_words_results = $wpdb->get_results("SELECT word FROM $answer_words_table", ARRAY_N);

    $results = [];

    foreach($guess_words_results as $row) {
        $results[] = $row[0];
    }
    foreach($answer_words_results as $row) {
        $results[] = $row[0];
    }

    return $results;
}

function wp_wordle_enqueue_scripts() {
    wp_enqueue_style('wp-wordle-style', plugins_url('style.css', __FILE__));
    wp_enqueue_script('wp-wordle-script', plugins_url('wordle.js', __FILE__), array('jquery'), null, true);

    //Pass the random word to JavaScript
    $answer_word = get_random_answer_word();
    $allowed_guess_words = get_guess_words();

    wp_localize_script('wp-wordle-script', 'WordleData', array(
        'answerWord' => $answer_word,
        'allowedGuessWords' => $allowed_guess_words 
    ));

}

add_action('wp_enqueue_scripts', 'wp_wordle_enqueue_scripts');

function wp_wordle_shortcode() {
    ob_start();
    ?>
    <div id="wordle-game">
        <!-- Game Grid -->
        <div class="grid">
            <!-- JavaScript will populate the grid -->
        </div>
        <!-- Input for player guesses -->
        <input type="text" id="guess-input" maxlength="5" placeholder="Enter guess" />
        <button id="submit-guess">Submit Guess</button>

        <div id="keyboard">
            <div class="keyboard-row">
                <button class="key">Q</button><button class="key">W</button><button class="key">E</button><button class="key">R</button><button class="key">T</button><button class="key">Y</button><button class="key">U</button><button class="key">I</button><button class="key">O</button><button class="key">P</button>
            </div>
        </div>
        <div class="keyboard-row">
            <button class="key">A</button><button class="key">S</button><button class="key">D</button>
            <button class="key">F</button><button class="key">G</button><button class="key">H</button>
            <button class="key">J</button><button class="key">K</button><button class="key">L</button>
        </div>
        <div class="keyboard-row">

            <button class="key big-key" id="enter-key">Enter</button>
            <button class="key">Z</button><button class="key">X</button><button class="key">C</button>
            <button class="key">V</button><button class="key">B</button><button class="key">N</button>
            <button class="key">M</button>
            <button class="key big-key" id="backspace-key">Backspace</button>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

add_shortcode('wordle-clone', 'wp_wordle_shortcode');
?>