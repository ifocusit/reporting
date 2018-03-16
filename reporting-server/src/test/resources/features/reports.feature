Feature: Reporting journalier

* on distingue 2 types de reporting par jour : les temps de travail et les jours de congés
* ils sont recherchés sur une période mensuelle
* les congés sont par défaut d'une journée
* les timbrages sont enregistrer à la minutes près
* un timbrage conrrespond au total d'heures travaillé sur une journée

  Scenario: lister les timbrages d'un mois
    Given un timbrage de 8h le 28.02.2018
    Given un timbrage de 8h le 01.03.2018
    Given un timbrage de 4h le 02.03.2018
    Given un timbrage de 9h le 31.03.2018
    Given un timbrage de 8h le 01.04.2018
    When je demande les timbrages du mois de Mars
    Then le système renvoie 3 timbrages
    Then le timbrage de 8h le 01.03.2018 apparait dans la liste
    Then le timbrage de 4h le 02.03.2018 apparait dans la liste
    Then le timbrage de 9h le 31.03.2018 apparait dans la liste
