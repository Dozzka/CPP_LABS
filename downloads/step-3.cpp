#include <iostream>
#include <vector>
using namespace std;

bool isComfortable(int t) {
    return t >= ____ && t <= 26;
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
    cout << "Check: " << isComfortable(18) << "\n";
    return 0;
}
