export default {
  methods: {
    sort_array: function(array, attr, reverse) {
      return array.sort((ele1, ele2) => {
        if (ele1[attr] < ele2[attr]) {
          return (-1 * reverse);
        } else if (ele1[attr] > ele2[attr]) {
          return (1 * reverse);
        } else {
          return 0;
        }
      });
    },

    calculate_bank_total_interests: function(bank, starting_balance, data) {
      let base_interests = this.calculate_base_interests(bank, starting_balance);
      let bonus_interests = this.calculate_bonus_interests(bank, starting_balance, data);
      let interests = [base_interests].concat(bonus_interests);

      let total_monthly_interest_amount = interests.reduce((total, interest) => {
        return total + parseFloat(interest.monthly_interest_amount);
      }, 0);

      return Object.assign({}, bank, {
        total_monthly_interest_amount: total_monthly_interest_amount,
        interests: interests,
        base_interests: base_interests,
        bonus_interests: bonus_interests
      });
    },

    highest_interests_bank: function(bank_results) {
      let sorted = this.sort_array(bank_results, 'total_monthly_interest_amount', -1);
      return sorted[0];
    },

    calculate_base_interests: function(bank, starting_balance) {
      let category = 'base';
      let base_requirement = {
        category: category,
        label: 'Base',
        description: 'Base interest',
        interests: bank.metadata.base_interests
      };

      let base_interests = this.calculate_tiered_interests(base_requirement.interests, category, starting_balance);
      return this.calculate_category_total(base_interests, base_requirement, starting_balance, category, starting_balance);
    },

    calculate_bonus_interests: function(bank, starting_balance, bonus_data) {
      if (bank.metadata.individual_requirement) {
        return this.calculate_individual(bank, starting_balance, bonus_data);
      } else {
        return this.calculate_cumulative(bank, starting_balance, bonus_data);
      }
    },

    filter_satisfied_requirements: function(requirements, bonus_data, category) {
      let category_data = bonus_data[category];
      let category_count = category_data.length;
      let category_amount = category_data.reduce((total, data) => {
        if (data.amount) {
          return total + parseFloat(data.amount);
        } else {
          return total;
        }
      }, 0);

      let category_requirements = requirements.filter(requirement => {
        return requirement.category === category;
      });

      let potential_requirements = category_requirements.reduce((hash, requirement) => {
        hash[requirement.id] = 0;
        return hash;
      }, {});

      category_data.forEach(data => {
        let category_amount = data.amount ? parseFloat(data.amount) : 0;

        category_requirements.forEach(requirement => {
          if (category_amount >= requirement.min_amount &&
              category_amount <= requirement.max_amount) {
            potential_requirements[requirement.id] += 1;
          }
        });
      });

      let satisfied_requirements = category_requirements.filter(requirement => {
        let count = potential_requirements[requirement.id];
        return count >= requirement.min_count && count <= requirement.max_count &&
          category_amount >= requirement.cumulative_min_amount && category_amount <= requirement.cumulative_max_amount;
      });

      return {
        satisfied_requirements: satisfied_requirements,
        category_amount: category_amount,
        category_count: category_count
      };
    },

    filter_cumulative_requirements: function(requirements, eligible_categories, eligible_count, eligible_amount) {
      return requirements.filter(requirement => {
        return requirement.required_categories.every(required_category => {
          return Object.keys(eligible_categories).includes(required_category);
        }) &&
          eligible_count >= requirement.min_count &&
          eligible_count <= requirement.max_count &&
          eligible_amount >= requirement.min_amount &&
          eligible_amount <= requirement.max_amount;
      });
    },

    format_zero_calculation: function(category, label, description, category_amount) {
      return {
        category: category,
        label: label,
        description: description,
        eligible_amount: category_amount,
        min_balance: 0,
        max_balance: 999999999.99,
        rate_pa: 0,
        monthly_interest_amount: 0
      };
    },

    calculate_cumulative_eligible_amount: function(eligible_categories) {
      return Object.values(eligible_categories).reduce((total, category) => {
        return total + parseFloat(category.amount);
      }, 0);
    },

    calculate_tiered_interests: function(interests, category, starting_balance) {
      return interests.map(interest => {
        if (starting_balance < interest.min_balance) {
          return Object.assign({}, interest, {
            category: category,
            eligible_amount: 0,
            monthly_interest_amount: 0
          });
        }

        let tier_amount = 0;
        if (starting_balance >= interest.max_balance) {
          tier_amount = interest.max_balance - interest.min_balance;
        } else {
          tier_amount = starting_balance - interest.min_balance;
        }

        let monthly_interest_amount = tier_amount * interest.rate_pa / 100 / 12;

        return Object.assign({}, interest, {
          category: category,
          eligible_amount: tier_amount,
          monthly_interest_amount: monthly_interest_amount
        });
      });
    },

    calculate_category_total: function(interests, requirement, starting_balance, category, category_amount) {
      let min_balance = 0;
      let max_balance = 999999999.99;
      let average_rate = 0;
      let total_monthly_interest_amount = 0;

      if (interests.length > 0) {
        min_balance = interests[0].min_balance;
      }

      if (interests.length === 1) {
        max_balance = interests[0].max_balance;
      } else if (interests.length > 1) {
        max_balance = interests[interests.length - 1].max_balance;
      }

      if (interests.length > 0) {
        total_monthly_interest_amount = interests.reduce((total, interest) => {
          return total + parseFloat(interest.monthly_interest_amount);
        }, 0);

        average_rate = 100 * 12 * total_monthly_interest_amount / starting_balance;
      }

      return Object.assign({}, requirement, {
        category: category,
        eligible_amount: category_amount,
        min_balance: min_balance,
        max_balance: max_balance,
        rate_pa: average_rate,
        monthly_interest_amount: total_monthly_interest_amount,
        interests: interests
      });
    },

    calculate_individual: function(bank, starting_balance, bonus_data) {
      return Object.keys(bonus_data).map(category => {
        let filter_result = this.filter_satisfied_requirements(bank.requirements, bonus_data, category);
        let satisfied_requirements = filter_result.satisfied_requirements;
        let category_amount = filter_result.category_amount;

        if (!satisfied_requirements[0]) {
          let potential_requirement = bank.requirements.find(requirement => {
            return requirement.category === category;
          });

          if (!potential_requirement) {
            potential_requirement = {
              label: '',
              description: ''
            };
          }

          return this.format_zero_calculation(category, potential_requirement.label, potential_requirement.description, category_amount);
        }

        let potential_interests = satisfied_requirements.map(satisfied_requirement => {
          let on_incremental_balance = !!satisfied_requirement.on_incremental_balance;
          let interests = [];

          if (on_incremental_balance) {
            bonus_data[category].forEach(category_data => {
              interests = interests.concat(this.calculate_tiered_interests(satisfied_requirement.interests, category, category_data.amount));
            });
          } else {
            interests = this.calculate_tiered_interests(satisfied_requirement.interests, category, starting_balance);
          }

          return this.calculate_category_total(interests, satisfied_requirement, starting_balance, category, category_amount);
        });

        let sorted = this.sort_array(potential_interests, 'monthly_interest_amount', -1);
        return sorted[0];
      });
    },

    calculate_cumulative: function(bank, starting_balance, bonus_data) {
      let cumulative_requirements = bank.cumulative_requirements;
      let individual_requirements = bank.requirements;

      let eligible_categories = {};
      Object.keys(bonus_data).forEach(category => {
        let filter_result = this.filter_satisfied_requirements(individual_requirements, bonus_data, category);
        let satisfied_requirements = filter_result.satisfied_requirements;
        let category_amount = filter_result.category_amount;
        let category_count = filter_result.category_count;

        if (satisfied_requirements.length > 0) {
          eligible_categories[category] = {
            amount: category_amount,
            count: category_count,
            satisfied_requirements: satisfied_requirements
          };
        }
      });

      let eligible_count = Object.keys(eligible_categories).length;
      let eligible_amount = this.calculate_cumulative_eligible_amount(eligible_categories);

      let cumulative_satisfied_requirements = this.filter_cumulative_requirements(cumulative_requirements, eligible_categories, eligible_count, eligible_amount);

      if (cumulative_satisfied_requirements.length === 0) {
        return [];
      }

      let potential_cumulative_interests = cumulative_satisfied_requirements.map(cumulative_requirement => {
        let interests = this.calculate_tiered_interests(cumulative_requirement.interests, cumulative_requirement.id, starting_balance);
        return this.calculate_category_total(interests, cumulative_requirement, starting_balance, cumulative_requirement.id, eligible_amount);
      });

      let sorted = this.sort_array(potential_cumulative_interests, 'monthly_interest_amount', -1);

      return [sorted[0]];
    }
  }
}
