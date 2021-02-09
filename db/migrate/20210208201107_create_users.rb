class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :f_name
      t.string :l_name

      t.timestamps
    end
  end
end
