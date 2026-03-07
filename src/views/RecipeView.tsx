import List from '@src/components/List'
import type { ListItem } from '@src/util/types'
import styles from '@src/views/RecipeView.module.css'
import omeletteImg from '@public/assets/images/image-omelette.jpeg'

const preparationTimeData: ListItem[] = [
  {
    name: 'Total',
    value: 'Approximately 10 minutes'
  },
  {
    name: 'Preparation',
    value: '5 minutes'
  },
  {
    name: 'Cooking',
    value: '5 minutes'
  }
]

const ingredients: ListItem[] = [
  {
    value: '2-3 large eggs'
  },
  {
    value: 'Salt, to taste'
  },
  {
    value: 'Pepper, to taste'
  },
  {
    value: '1 tablespoon of butter or oil'
  },
  {
    value: 'Optional fillings: cheese, diced vegetables, cooked meats, herbs'
  }
]

const instructionsData: ListItem[] = [
  {
    name: 'Beat the eggs',
    value:
      'In a bowl, beat the eggs with a pinch of salt and pepper until they are well mixed. You can add a tablespoon of water or milk for a fluffier texture.'
  },
  {
    name: 'Heat the pan',
    value:
      'Place a non-stick frying pan over medium heat and add butter or oil.'
  },
  {
    name: 'Cook the omelette',
    value:
      'Once the butter is melted and bubbling, pour in the eggs. Tilt the pan to ensure the eggs evenly coat the surface.'
  },
  {
    name: 'Add fillings (optional)',
    value:
      'When the eggs begin to set at the edges but are still slightly runny in the middle, sprinkle your chosen fillings over one half of the omelette.'
  },
  {
    name: 'Fold and serve',
    value:
      'As the omelette continues to cook, carefully lift one edge and fold it over the fillings. Let it cook for another minute, then slide it onto a plate.'
  },
  {
    name: 'Enjoy',
    value: 'Serve hot, with additional salt and pepper if needed.'
  }
]

const nutritionData: ListItem[] = [
  {
    name: 'Calories',
    value: '277kcal'
  },
  {
    name: 'Carbs',
    value: '0g'
  },
  {
    name: 'Protein',
    value: '20g'
  },
  {
    name: 'Fat',
    value: '22g'
  }
]

const RecipeView = () => {
  return (
    <div className={styles.recipeView}>
      <article className={styles.recipeContainer}>
        <img src={omeletteImg} alt='Omelette' className={styles.mainImage} />
        <header className={styles.mainHeader}>Simple Omelette Recipe</header>
        <p className={styles.paragraph}>
          An easy and quick dish, perfect for any meal. This classic omelette
          combines beaten eggs cooked to perfection, optionally filled with your
          choice of cheese, vegetables, or meats.
        </p>
        <section className={styles.preparationTimeSection}>
          <header className={styles.preparationTimeHeader}>
            Preparation time
          </header>
          <List type='ul' items={preparationTimeData} />
        </section>
        <section>
          <header>Ingredients</header>
          <List type='ul' items={ingredients} />
        </section>
        <hr />
        <section>
          <header>Instructions</header>
          <List type='ol' items={instructionsData} />
        </section>
        <hr />
        <section>
          <header>Nutrition</header>
          <p className={styles.paragraph}>
            The table below shows nutritional values per serving without the
            additional fillings.
          </p>
          <table>
            <tbody>
              {nutritionData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>
    </div>
  )
}

export default RecipeView
