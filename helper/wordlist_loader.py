import mysql.connector

database = "wordpress_db"

answer_words_table = "wp_answer_words"
guess_words_table = "wp_guess_words"

# File path to the word list
answer_words_file = "answer_words.txt"
guess_words_file = "guess_words.txt"



def create_table(table:str, cursor):
    drop_sql = f"DROP TABLE IF EXISTS {table}"
    create_sql = f"CREATE TABLE `{database}`.`{table}` (`id` INT NOT NULL AUTO_INCREMENT , `word` VARCHAR(5) NOT NULL , PRIMARY KEY (`id`), UNIQUE `word_unique` (`word`)) ENGINE = InnoDB;"
    cursor.execute(drop_sql)
    cursor.execute(create_sql)

def load_wordlist(file_name:str, table:str, cursor) :
    with open(file_name, "r")as file :
        for word in file:
            word = word.strip()
            print(word)
            if len(word) != 5:
                raise Exception("Word length not 5, something went wrong. Word was " + word)
            sql = f"INSERT IGNORE INTO {table} (word) VALUES (%s)"
            cursor.execute(sql, (word,))


def main():
    db = mysql.connector.connect(
        host="localhost",
        user="wordpressadmin",
        password="password",
        database=database
    )

    cursor = db.cursor()

    

    create_table(answer_words_table, cursor)
    create_table(guess_words_table, cursor)

    load_wordlist(answer_words_file, answer_words_table, cursor)
    load_wordlist(guess_words_file, guess_words_table, cursor)


    # Commit the changes and close the connection
    db.commit()
    cursor.close()
    db.close()


if __name__ == "__main__":
    main()

    
