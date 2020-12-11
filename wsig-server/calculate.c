#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>
#include <limits.h>
#include <memory.h>


int bestFlightDates(int arrayLen, int * flightPrices) {
    int bestPrice = INT_MAX;
    
    for(int i=0; i<arrayLen; i++) {
        if(flightPrices[i] < bestPrice) {
            bestPrice = flightPrices[i];
        }
    }

    return (bestPrice == INT_MAX) ? 0 : bestPrice;
}

float weatherRating(int arrayLen, float * prcpArr, int bestPrcp) {
    if(bestPrcp == 0) {
        return 0.0;
    }

    float daysRainy = 0.0;

    for(int i=0; i<arrayLen; i++) {
        if(prcpArr[i] >= 1.0 && prcpArr[i] < 2.5) {
            daysRainy += 0.10;
        }
        else if(prcpArr[i] >= 2.5 && prcpArr[i] < 7.5) {
            daysRainy += 0.50;
        }
        else if(prcpArr[i] >= 7.5) {
            daysRainy += 1.00;
        }
    }

    if(bestPrcp == 1) {
        return (daysRainy / (float) arrayLen) * 100.0;
    }
    return 100.0 - (daysRainy / (float) arrayLen) * 100.0;
}


float temperatureRating(int arrayLen, float * tempArr, int bestTemp) {
   float low = -100;
   float high = 100;
   float score = 0;
   float brackets = 2.5;

    if(bestTemp == 1) {
        high = 0;
    }
    else if(bestTemp == 2) {
        low = 0;
        high = 5;
    }
    else if(bestTemp == 3) {
        low = 5;
        high = 12.5;
    }
    else if(bestTemp == 4) {
        low = 12.5; 
        high = 17.5;
    }
    else if(bestTemp == 5) {
        low = 17.5;
    }

    for(int i=0; i<arrayLen; i++) {
        float sampleTemp = tempArr[i];

        if(sampleTemp >= low && sampleTemp <= high) {
            score += 1.0;
        }
        else if(sampleTemp < low) {
            float deviations = 1 + (low - sampleTemp) / brackets;
            score += 1/deviations;
        }
        else if(sampleTemp > high) {
            float deviations = 1 + (sampleTemp - high) / brackets;
            score += 1/deviations;
        }

    }

    return score / arrayLen * 100.0;
}