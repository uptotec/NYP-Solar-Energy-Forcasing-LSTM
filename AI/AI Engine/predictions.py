import pymongo
import tensorflow as tf
import os
import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta


def connect_to_mongodb(database_url, database_name):
    try:
        # Connect to the MongoDB server
        client = pymongo.MongoClient(database_url)

        # Print connection success message
        print(f"Connected to MongoDB database '{database_name}'")

        return client  # Return the client object
    except pymongo.errors.ConnectionFailure as e:
        print(f"Connection to MongoDB failed: {e}")
        return None


if __name__ == "__main__":
    # Replace 'mongodb://localhost:27017/' with your MongoDB URL
    # and 'your_database_name' with the name of your database.
    database_url = 'mongodb+srv://uptotec:Uptotec2001@solarirr.nrqc5m3.mongodb.net/solarirr?retryWrites=true&w=majority'
    database_name = 'solarirr'

    # Connect to the database
    client = connect_to_mongodb(database_url, database_name)

    # Check if the client is not None before proceeding
    if client:
        # Access the specified database
        db = client[database_name]

        csv_path = '../data/hourly/Marseille 2018-2020.csv'
        df = pd.read_csv(csv_path)

        dateTimeAxis = pd.to_datetime(
            df['date'] + ' ' + df['time'], format='%d/%m/%Y %I:%M %p')
        df.index = dateTimeAxis

        df = df.drop(['date', 'time'], axis=1)

        scaler = StandardScaler()
        scaler = scaler.fit(df)
        df = scaler.transform(df)

        def df_to_X_y(df, window_size=168, output_size=24):
            # df_as_np = df.to_numpy()
            df_as_np = df
            X = []
            y = []
            for i in range(len(df_as_np)-window_size-output_size):
                row = df_as_np[i:i+window_size]
                X.append(row)
                label = df_as_np[i + window_size:i +
                                 window_size + output_size][:, 1]
                y.append(label)
            return np.array(X), np.array(y)

        WINDOW_SIZE = 24*7*2
        OUTPUT_SIZE = 24
        no_of_variables = 8
        X1, y1 = df_to_X_y(df, WINDOW_SIZE, OUTPUT_SIZE)

        a = -1
        twoWeeks = X1[a]

        model1 = load_model('../models/Marseille/oneDayWithTwoWeeks/')
        predictions = model1.predict(np.array([twoWeeks]))

        predictions_rescale = scaler.inverse_transform(
            predictions[0].reshape(3, 8)).flatten()

        # Perform operations here
        collection = db["predictions"]
        data = {"model": 1, "city": 0,
                'predections': predictions_rescale.tolist(), 'step': 0, 'startPrediction': dateTimeAxis[dateTimeAxis.index[-1]] + timedelta(hours=1)}
        data['createdAt'] = datetime.now()
        collection.insert_one(data)

        # Close the connection to the MongoDB server
        client.close()
