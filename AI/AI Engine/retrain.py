import tensorflow as tf
import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import *
from tensorflow.keras.callbacks import ModelCheckpoint
from tensorflow.keras.losses import MeanSquaredError
from tensorflow.keras.metrics import RootMeanSquaredError
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.models import load_model

csv_path = './Marseille.csv'
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
        label = df_as_np[i + window_size:i + window_size + output_size][:, 1]
        y.append(label)
    return np.array(X), np.array(y)


WINDOW_SIZE = 24**7*2
OUTPUT_SIZE = 24*3
no_of_variables = 8
X1, y1 = df_to_X_y(df, WINDOW_SIZE, OUTPUT_SIZE)

end_train = int(len(X1) * 0.9)
end_val = int(len(X1) * 1)

X_train1, y_train1, time_train = X1[:end_train], y1[:
                                                    end_train], dateTimeAxis[:end_train]
X_val1, y_val1, time_val = X1[end_train:end_val], y1[end_train:
                                                     end_val], dateTimeAxis[end_train:end_val]

cp1 = ModelCheckpoint('newModel/', save_best_only=True)

model1 = load_model('oneDayWithTwoWeeks/')

model1.fit(X_train1, y_train1, validation_data=(X_val1, y_val1),
           batch_size=16, epochs=20, callbacks=[cp1])
