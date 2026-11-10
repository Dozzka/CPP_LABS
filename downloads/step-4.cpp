#include <iostream>
#include <vector>
using namespace std;

bool isComfortable(int t) {
    return t >= 18 && t <= 26;
}

int main() {
    vector<int> temperature(7);
    for (int i = 0; i < 7; i++) {
        cin >> temperature[i];
    }
    cout << "Data:";
    for (int i = 0; i < 7; i++) {
        cout << " " << temperature[i];
    }
    cout << "\n";
    int comfortable = 0;
    for (int i = 0; i < 7; i++) {
        if (____(temperature[i])) {
            comfortable++;
        }
    }
    cout << "Comfortable: " << comfortable << "\n";
    return 0;
}
